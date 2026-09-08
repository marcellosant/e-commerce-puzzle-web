import { LANDMARK, type Landmark, type Size } from "@/lib/tryon/face-anchor";

/**
 * A stand-in head that produces detector-shaped output for any pose.
 *
 * The try-on can only be exercised in front of a real camera, which makes the
 * geometry expensive to check: every question costs a round trip to a person
 * pulling faces at a phone. Placing known landmarks on a rigid head and
 * projecting them gives the same shape of input for any pose, on demand, so
 * the placement maths can be swept across the full range of head movement in
 * a test.
 *
 * It says nothing about whether the detector finds a real face, or whether the
 * result looks good on real skin under real light. It only answers whether the
 * arithmetic downstream of detection holds up — which is where every bug found
 * so far has been.
 */

export interface HeadPose {
  /** Turn left/right, radians. */
  yaw?: number;
  /** Tilt up/down, radians. */
  pitch?: number;
  /** Head roll toward a shoulder, radians. */
  roll?: number;
  /** How far the head sits from the camera, millimetres. */
  distanceMm?: number;
}

/**
 * Landmark positions on a canonical adult head, millimetres, origin at the
 * bridge of the nose. +X to the subject's left, +Y up, +Z out of the face.
 *
 * The outer eye corners sit behind the bridge as well as beside it, because
 * the face curves back toward the ears — that offset is what makes the
 * projected distance between them shrink under yaw.
 */
const CANONICAL_MM: Record<number, readonly [number, number, number]> = {
  [LANDMARK.eyeOuterA]: [-45, -5, -30],
  [LANDMARK.eyeOuterB]: [45, -5, -30],
  [LANDMARK.noseBridge]: [0, 0, 0],
};

const DEFAULT_DISTANCE_MM = 500;

/**
 * Roughly the centre of the skull, in the same frame as the landmarks.
 *
 * A head pivots about its own centre, not about the bridge of its nose.
 * Rotating about the bridge kept it pinned in place through every turn, which
 * is both unlike a real head and quietly useless as a test: it hid whether the
 * frame follows the face at all.
 */
const PIVOT_MM: readonly [number, number, number] = [0, -30, -90];

type Vec3 = [number, number, number];

function rotate({ yaw = 0, pitch = 0, roll = 0 }: HeadPose, [x, y, z]: Vec3): Vec3 {
  // Roll, then pitch, then yaw — matching the YXZ order the renderer reads
  // angles back in.
  const cr = Math.cos(roll);
  const sr = Math.sin(roll);
  let px = x * cr - y * sr;
  let py = x * sr + y * cr;
  let pz = z;

  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  const py2 = py * cp - pz * sp;
  pz = py * sp + pz * cp;
  py = py2;

  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const px2 = px * cy + pz * sy;
  pz = -px * sy + pz * cy;
  px = px2;

  return [px, py, pz];
}

/**
 * Projects the canonical head at a given pose into the normalised form the
 * detector reports: x and y as fractions of frame width and height, z on the
 * same scale as x and measured from the head's own depth.
 *
 * A pinhole camera whose focal length equals the frame width — near enough to
 * a phone's front camera, and it makes the depth normalisation exact.
 */
export function syntheticLandmarks(pose: HeadPose, video: Size): Landmark[] {
  const distance = pose.distanceMm ?? DEFAULT_DISTANCE_MM;
  const focal = video.width;

  // Only the indices the placement code reads are meaningful; the rest exist
  // so the array is shaped like the detector's.
  const landmarks: Landmark[] = Array.from({ length: 468 }, () => ({
    x: 0.5,
    y: 0.5,
    z: 0,
  }));

  for (const [indexKey, point] of Object.entries(CANONICAL_MM)) {
    const index = Number(indexKey);

    // Rotate about the skull's centre, then put the head back where it was.
    const local: Vec3 = [
      point[0] - PIVOT_MM[0],
      point[1] - PIVOT_MM[1],
      point[2] - PIVOT_MM[2],
    ];
    const spun = rotate(pose, local);
    const rx = spun[0] + PIVOT_MM[0];
    const ry = spun[1] + PIVOT_MM[1];
    const rz = spun[2] + PIVOT_MM[2];

    // Camera at the origin looking down -Z, head pushed out in front of it.
    const depth = distance - rz;

    const u = (focal * rx) / depth + video.width / 2;
    const v = (-focal * ry) / depth + video.height / 2;

    landmarks[index] = {
      x: u / video.width,
      y: v / video.height,
      // With focal length equal to width, one normalised x unit spans exactly
      // `distance` millimetres at the head, so depth normalises by distance.
      z: (depth - distance) / distance,
    };
  }

  return landmarks;
}
