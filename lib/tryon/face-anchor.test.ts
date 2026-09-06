import { describe, expect, it } from "vitest";
import {
  FRAME_WIDTH_RATIO,
  LANDMARK,
  computeFrameAnchor,
  coverTransform,
  landmarkToDisplay,
  rotationFromPoseMatrix,
  smoothAngleTowards,
  smoothTowards,
  type Landmark,
} from "@/lib/tryon/face-anchor";

describe("coverTransform", () => {
  it("scales to fill and centres the overflow when the video is wider", () => {
    // 640x480 video in a 400x800 element: height is the binding dimension.
    const t = coverTransform({ width: 640, height: 480 }, { width: 400, height: 800 });
    expect(t.scale).toBeCloseTo(800 / 480);
    // Scaled width overflows, so the offset is negative and symmetric.
    expect(t.offsetX).toBeCloseTo((400 - 640 * (800 / 480)) / 2);
    expect(t.offsetY).toBeCloseTo(0);
  });

  it("uses width when that is the binding dimension", () => {
    const t = coverTransform({ width: 640, height: 480 }, { width: 1280, height: 500 });
    expect(t.scale).toBeCloseTo(2);
    expect(t.offsetX).toBeCloseTo(0);
    expect(t.offsetY).toBeCloseTo((500 - 480 * 2) / 2);
  });

  it("is the identity when the sizes already match", () => {
    const t = coverTransform({ width: 640, height: 480 }, { width: 640, height: 480 });
    expect(t.scale).toBe(1);
    expect(t.offsetX).toBe(0);
    expect(t.offsetY).toBe(0);
  });
});

describe("landmarkToDisplay", () => {
  const video = { width: 640, height: 480 };
  const display = { width: 640, height: 480 };

  it("maps the centre of the frame to the centre of the element", () => {
    const p = landmarkToDisplay({ x: 0.5, y: 0.5 }, video, display, false);
    expect(p.x).toBeCloseTo(320);
    expect(p.y).toBeCloseTo(240);
  });

  it("leaves the centre fixed when mirrored", () => {
    const p = landmarkToDisplay({ x: 0.5, y: 0.5 }, video, display, true);
    expect(p.x).toBeCloseTo(320);
  });

  it("flips horizontally when mirrored, leaving y alone", () => {
    const plain = landmarkToDisplay({ x: 0.25, y: 0.4 }, video, display, false);
    const flipped = landmarkToDisplay({ x: 0.25, y: 0.4 }, video, display, true);
    expect(plain.x).toBeCloseTo(160);
    expect(flipped.x).toBeCloseTo(480);
    expect(flipped.y).toBeCloseTo(plain.y);
  });

  it("accounts for cropping when aspect ratios differ", () => {
    // A 16:9 video shown in a square element is cropped left and right, so a
    // landmark at the video's horizontal centre still lands centre-screen.
    const p = landmarkToDisplay(
      { x: 0.5, y: 0.5 },
      { width: 1600, height: 900 },
      { width: 500, height: 500 },
      false
    );
    expect(p.x).toBeCloseTo(250);
    expect(p.y).toBeCloseTo(250);
  });
});

function landmarksWith(overrides: Record<number, Landmark>): Landmark[] {
  const points: Landmark[] = Array.from({ length: 468 }, () => ({ x: 0.5, y: 0.5 }));
  for (const [index, value] of Object.entries(overrides)) {
    points[Number(index)] = value;
  }
  return points;
}

describe("computeFrameAnchor", () => {
  const video = { width: 640, height: 480 };
  const display = { width: 640, height: 480 };

  it("centres the frame on the nose bridge", () => {
    const anchor = computeFrameAnchor(
      landmarksWith({
        [LANDMARK.eyeOuterA]: { x: 0.4, y: 0.5 },
        [LANDMARK.eyeOuterB]: { x: 0.6, y: 0.5 },
        [LANDMARK.noseBridge]: { x: 0.5, y: 0.48 },
      }),
      video,
      display,
      false
    );

    expect(anchor).not.toBeNull();
    expect(anchor!.center.x).toBeCloseTo(320);
    expect(anchor!.center.y).toBeCloseTo(0.48 * 480);
  });

  it("scales with the span between the eyes", () => {
    const near = computeFrameAnchor(
      landmarksWith({
        [LANDMARK.eyeOuterA]: { x: 0.3, y: 0.5 },
        [LANDMARK.eyeOuterB]: { x: 0.7, y: 0.5 },
        [LANDMARK.noseBridge]: { x: 0.5, y: 0.5 },
      }),
      video,
      display,
      false
    );
    const far = computeFrameAnchor(
      landmarksWith({
        [LANDMARK.eyeOuterA]: { x: 0.45, y: 0.5 },
        [LANDMARK.eyeOuterB]: { x: 0.55, y: 0.5 },
        [LANDMARK.noseBridge]: { x: 0.5, y: 0.5 },
      }),
      video,
      display,
      false
    );

    // Eyes four times as far apart means a frame four times as wide.
    expect(near!.widthPx / far!.widthPx).toBeCloseTo(4);
    expect(near!.widthPx).toBeCloseTo(0.4 * 640 * FRAME_WIDTH_RATIO);
  });

  it("holds its size as the head turns", () => {
    // Facing the camera: the eyes are far apart on screen and level in depth.
    const facing = computeFrameAnchor(
      landmarksWith({
        [LANDMARK.eyeOuterA]: { x: 0.4, y: 0.5, z: 0 },
        [LANDMARK.eyeOuterB]: { x: 0.6, y: 0.5, z: 0 },
        [LANDMARK.noseBridge]: { x: 0.5, y: 0.5, z: -0.05 },
      }),
      video,
      display,
      false
    );

    // Turned 60 degrees. The eyes are still 0.2 apart in space, but only
    // 0.2·cos60 = 0.1 of that still projects across the screen; the rest,
    // 0.2·sin60, has gone into depth. The frame must not shrink.
    const turn = Math.PI / 3;
    const turned = computeFrameAnchor(
      landmarksWith({
        [LANDMARK.eyeOuterA]: { x: 0.45, y: 0.5, z: 0 },
        [LANDMARK.eyeOuterB]: { x: 0.55, y: 0.5, z: -0.2 * Math.sin(turn) },
        [LANDMARK.noseBridge]: { x: 0.5, y: 0.5, z: -0.05 },
      }),
      video,
      display,
      false
    );

    expect(facing!.widthPx).toBeCloseTo(turned!.widthPx, 1);
  });

  it("ignores depth when the detector reports none", () => {
    const anchor = computeFrameAnchor(
      landmarksWith({
        [LANDMARK.eyeOuterA]: { x: 0.4, y: 0.5 },
        [LANDMARK.eyeOuterB]: { x: 0.6, y: 0.5 },
        [LANDMARK.noseBridge]: { x: 0.5, y: 0.5 },
      }),
      video,
      display,
      false
    );
    expect(anchor!.widthPx).toBeCloseTo(0.2 * 640 * FRAME_WIDTH_RATIO);
  });

  it("reports zero roll for level eyes and follows a tilt", () => {
    const level = computeFrameAnchor(
      landmarksWith({
        [LANDMARK.eyeOuterA]: { x: 0.4, y: 0.5 },
        [LANDMARK.eyeOuterB]: { x: 0.6, y: 0.5 },
        [LANDMARK.noseBridge]: { x: 0.5, y: 0.5 },
      }),
      video,
      display,
      false
    );
    expect(level!.roll).toBeCloseTo(0);

    const tilted = computeFrameAnchor(
      landmarksWith({
        [LANDMARK.eyeOuterA]: { x: 0.4, y: 0.5 },
        [LANDMARK.eyeOuterB]: { x: 0.6, y: 0.5 + (0.2 * 640) / 480 },
        [LANDMARK.noseBridge]: { x: 0.5, y: 0.5 },
      }),
      video,
      display,
      false
    );
    expect(tilted!.roll).toBeCloseTo(Math.PI / 4);
  });

  it("returns null when the needed landmarks are missing", () => {
    expect(computeFrameAnchor([], video, display, false)).toBeNull();
  });
});

describe("rotationFromPoseMatrix", () => {
  it("returns identity rotation for an identity matrix", () => {
    const r = rotationFromPoseMatrix([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ]);
    expect(r).not.toBeNull();
    expect(r!.slice(0, 3)).toEqual([1, 0, 0]);
    expect(r!.slice(4, 7)).toEqual([0, 1, 0]);
  });

  it("strips scale, keeping only orientation", () => {
    // Same orientation as identity, uniformly scaled by 3.
    const r = rotationFromPoseMatrix([
      3, 0, 0, 0,
      0, 3, 0, 0,
      0, 0, 3, 0,
      0, 0, 0, 1,
    ]);
    expect(r![0]).toBeCloseTo(1);
    expect(r![5]).toBeCloseTo(1);
    expect(r![10]).toBeCloseTo(1);
  });

  it("discards the translation column", () => {
    const r = rotationFromPoseMatrix([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      12, -4, 30, 1,
    ]);
    expect(r!.slice(12)).toEqual([0, 0, 0, 1]);
  });

  it("rejects a matrix of the wrong length or a degenerate one", () => {
    expect(rotationFromPoseMatrix([1, 0, 0])).toBeNull();
    expect(rotationFromPoseMatrix(new Array(16).fill(0))).toBeNull();
  });
});

describe("smoothTowards", () => {
  it("moves toward the target without overshooting", () => {
    const next = smoothTowards(0, 10, 8, 1 / 60);
    expect(next).toBeGreaterThan(0);
    expect(next).toBeLessThan(10);
  });

  it("converges on the target over time", () => {
    let value = 0;
    for (let i = 0; i < 240; i++) value = smoothTowards(value, 10, 8, 1 / 60);
    expect(value).toBeCloseTo(10, 3);
  });

  it("covers the same ground per unit time whatever the framerate", () => {
    let at60 = 0;
    for (let i = 0; i < 60; i++) at60 = smoothTowards(at60, 10, 8, 1 / 60);

    let at30 = 0;
    for (let i = 0; i < 30; i++) at30 = smoothTowards(at30, 10, 8, 1 / 30);

    expect(at60).toBeCloseTo(at30, 5);
  });
});

describe("smoothAngleTowards", () => {
  it("takes the short way around the wrap point", () => {
    // From just under +π to just over -π is a small step, not a near-full turn.
    const next = smoothAngleTowards(Math.PI - 0.05, -Math.PI + 0.05, 8, 1 / 60);
    expect(next).toBeGreaterThan(Math.PI - 0.05);
  });

  it("behaves like the linear version well away from the wrap", () => {
    expect(smoothAngleTowards(0, 0.5, 8, 1 / 60)).toBeCloseTo(
      smoothTowards(0, 0.5, 8, 1 / 60)
    );
  });
});
