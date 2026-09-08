/**
 * Maps face landmarks onto the on-screen video so the frame can be placed over
 * the wearer's eyes.
 *
 * Kept free of Three.js and of the DOM so the arithmetic — which is where
 * misalignment bugs actually live — can be unit tested.
 */

export interface Point2D {
  x: number;
  y: number;
}

/**
 * A landmark as the detector reports it: x and y normalised against the frame's
 * width and height, z roughly on the same scale as x and negative toward the
 * camera.
 */
export interface Landmark extends Point2D {
  z?: number;
}

export interface Size {
  width: number;
  height: number;
}

/** Indices into MediaPipe's 468-point face mesh. */
export const LANDMARK = {
  /** Outer corner of one eye. */
  eyeOuterA: 33,
  /** Outer corner of the other eye. */
  eyeOuterB: 263,
  /** Bridge of the nose, between the eyes — where a frame actually rests. */
  noseBridge: 168,
} as const;

/**
 * How much wider the frame's rims are than the span between the outer eye
 * corners. Eyewear reaches past the eyes toward the temples, so this is always
 * greater than one; the value is settled by looking at a face wearing it.
 */
export const FRAME_WIDTH_RATIO = 1.68;

/**
 * The video is rendered with object-cover, so it is scaled up until it fills
 * the element and the overflow is cropped evenly. Landmarks arrive in video
 * coordinates, so anything drawn over the video has to repeat that same
 * transform or it drifts — most visibly when the element and the camera have
 * different aspect ratios.
 */
export function coverTransform(video: Size, display: Size) {
  const scale = Math.max(
    display.width / video.width,
    display.height / video.height
  );
  return {
    scale,
    offsetX: (display.width - video.width * scale) / 2,
    offsetY: (display.height - video.height * scale) / 2,
  };
}

/**
 * Converts one normalised landmark (0..1 within the camera frame) to a pixel
 * position within the displayed element, top-left origin.
 *
 * `mirrored` accounts for the selfie flip: the video is mirrored in CSS so the
 * wearer sees themselves the way a mirror shows them, and the overlay has to
 * be flipped to match or it tracks the wrong side of the face.
 */
export function landmarkToDisplay(
  landmark: Point2D,
  video: Size,
  display: Size,
  mirrored: boolean
): Point2D {
  const { scale, offsetX, offsetY } = coverTransform(video, display);
  const x = landmark.x * video.width * scale + offsetX;
  const y = landmark.y * video.height * scale + offsetY;
  return { x: mirrored ? display.width - x : x, y };
}

export interface FrameAnchor {
  /** Where the bridge of the frame belongs, in display pixels. */
  center: Point2D;
  /** How wide the frame should be drawn, in display pixels. */
  widthPx: number;
  /** In-plane tilt, radians. Positive rotates clockwise on screen. */
  roll: number;
}

/**
 * Distance between two landmarks in three dimensions, expressed in the pixel
 * scale of the camera frame.
 *
 * The obvious measure — how far apart the eyes look on screen — collapses as
 * the head turns, because both eyes project toward the same place. Sizing from
 * it made the frame shrink whenever the wearer looked away. The true 3D
 * separation doesn't change with yaw, so it holds size steady through a turn.
 *
 * The axes arrive normalised differently: x and z against frame width, y
 * against frame height. They are put back into a common scale before measuring.
 */
export function landmarkDistance3D(
  a: Landmark,
  b: Landmark,
  video: Size
): number {
  const dx = (b.x - a.x) * video.width;
  const dy = (b.y - a.y) * video.height;
  const dz = ((b.z ?? 0) - (a.z ?? 0)) * video.width;
  return Math.hypot(dx, dy, dz);
}

/**
 * Derives placement from three landmarks.
 *
 * Position and roll come from where the face appears on screen; size comes
 * from the 3D span between the eye corners, which self-calibrates to the
 * wearer's face and their distance from the camera without needing to know
 * either, and survives the head turning away.
 */
export function computeFrameAnchor(
  landmarks: Landmark[],
  video: Size,
  display: Size,
  mirrored: boolean
): FrameAnchor | null {
  const a = landmarks[LANDMARK.eyeOuterA];
  const b = landmarks[LANDMARK.eyeOuterB];
  const bridge = landmarks[LANDMARK.noseBridge];
  if (!a || !b || !bridge) return null;

  const pa = landmarkToDisplay(a, video, display, mirrored);
  const pb = landmarkToDisplay(b, video, display, mirrored);
  const center = landmarkToDisplay(bridge, video, display, mirrored);

  // Measured in camera pixels, then carried through the same cover scale the
  // video is drawn with so it lands in display pixels.
  const { scale } = coverTransform(video, display);
  const eyeSpan = landmarkDistance3D(a, b, video) * scale;

  return {
    center,
    widthPx: eyeSpan * FRAME_WIDTH_RATIO,
    roll: Math.atan2(pb.y - pa.y, pb.x - pa.x),
  };
}

/**
 * Pulls just the rotation out of MediaPipe's 4x4 head-pose matrix, which
 * arrives column-major.
 *
 * Only rotation is taken. Position and scale come from landmarks instead,
 * because using the matrix's translation would require the render camera to
 * match the intrinsics MediaPipe assumed — rotation carries no such
 * dependency, so this stays correct whatever the projection.
 */
export function rotationFromPoseMatrix(matrix: number[]): number[] | null {
  if (matrix.length !== 16) return null;

  // Column vectors of the upper-left 3x3.
  const columns = [
    [matrix[0], matrix[1], matrix[2]],
    [matrix[4], matrix[5], matrix[6]],
    [matrix[8], matrix[9], matrix[10]],
  ];

  // Normalising drops any scale the matrix carries, leaving pure rotation.
  const normalised = columns.map((c) => {
    const length = Math.hypot(c[0], c[1], c[2]);
    return length === 0 ? [0, 0, 0] : [c[0] / length, c[1] / length, c[2] / length];
  });
  if (normalised.some((c) => c[0] === 0 && c[1] === 0 && c[2] === 0)) return null;

  return [
    normalised[0][0], normalised[0][1], normalised[0][2], 0,
    normalised[1][0], normalised[1][1], normalised[1][2], 0,
    normalised[2][0], normalised[2][1], normalised[2][2], 0,
    0, 0, 0, 1,
  ];
}

/**
 * Eases a value toward a target, framerate-independently.
 *
 * Raw landmarks jitter by a pixel or two every frame, which on a rigid object
 * held against the face reads as trembling. `responsiveness` is roughly "how
 * much of the gap is closed per second".
 */
export function smoothTowards(
  current: number,
  target: number,
  responsiveness: number,
  deltaSeconds: number
): number {
  const t = 1 - Math.exp(-responsiveness * deltaSeconds);
  return current + (target - current) * t;
}

/** Angle-aware variant, so a wrap past ±π doesn't spin the frame the long way. */
export function smoothAngleTowards(
  current: number,
  target: number,
  responsiveness: number,
  deltaSeconds: number
): number {
  let delta = target - current;
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  return smoothTowards(current, current + delta, responsiveness, deltaSeconds);
}
