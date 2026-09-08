import { describe, expect, it } from "vitest";
import { computeFrameAnchor } from "@/lib/tryon/face-anchor";
import { syntheticLandmarks, type HeadPose } from "@/lib/tryon/synthetic-face";

/**
 * Sweeps the placement maths across the range a head actually moves through.
 *
 * These are the checks that used to cost a trip to a phone. The frame
 * shrinking under yaw — the worst bug in this feature — shows up here as a
 * plain assertion failure.
 */

const VIDEO = { width: 640, height: 480 };
const DISPLAY = { width: 390, height: 760 };

const degrees = (d: number) => (d * Math.PI) / 180;

function anchorAt(pose: HeadPose) {
  const anchor = computeFrameAnchor(
    syntheticLandmarks(pose, VIDEO),
    VIDEO,
    DISPLAY,
    false
  );
  if (!anchor) throw new Error("no anchor for pose " + JSON.stringify(pose));
  return anchor;
}

describe("size across head movement", () => {
  const facing = anchorAt({});

  it("holds within 5% across a full range of turn", () => {
    for (const yaw of [-70, -50, -30, -15, 0, 15, 30, 50, 70]) {
      const { widthPx } = anchorAt({ yaw: degrees(yaw) });
      const drift = Math.abs(widthPx - facing.widthPx) / facing.widthPx;
      expect(drift, `yaw ${yaw}deg drifted ${(drift * 100).toFixed(1)}%`).toBeLessThan(0.05);
    }
  });

  // Some drift is unavoidable. Depth is normalised against one distance for
  // the whole head, so at steep angles, where one eye is markedly closer than
  // the other, the reconstructed separation is slightly off. It was around
  // half the frame's width before depth was considered at all; a few percent
  // at the edge of the range is not visible.
  it("holds within 8% across a full range of tilt", () => {
    for (const pitch of [-40, -25, -10, 0, 10, 25, 40]) {
      const { widthPx } = anchorAt({ pitch: degrees(pitch) });
      const drift = Math.abs(widthPx - facing.widthPx) / facing.widthPx;
      expect(drift, `pitch ${pitch}deg drifted ${(drift * 100).toFixed(1)}%`).toBeLessThan(0.08);
    }
  });

  it("holds within 5% when turn and tilt combine", () => {
    for (const yaw of [-45, 0, 45]) {
      for (const pitch of [-30, 0, 30]) {
        const { widthPx } = anchorAt({ yaw: degrees(yaw), pitch: degrees(pitch) });
        const drift = Math.abs(widthPx - facing.widthPx) / facing.widthPx;
        expect(
          drift,
          `yaw ${yaw} pitch ${pitch} drifted ${(drift * 100).toFixed(1)}%`
        ).toBeLessThan(0.05);
      }
    }
  });

  it("is unaffected by head roll", () => {
    for (const roll of [-40, -20, 0, 20, 40]) {
      const { widthPx } = anchorAt({ roll: degrees(roll) });
      expect(widthPx).toBeCloseTo(facing.widthPx, 0);
    }
  });

  it("grows as the wearer comes closer and shrinks as they move away", () => {
    const near = anchorAt({ distanceMm: 300 });
    const mid = anchorAt({ distanceMm: 500 });
    const away = anchorAt({ distanceMm: 800 });

    expect(near.widthPx).toBeGreaterThan(mid.widthPx);
    expect(mid.widthPx).toBeGreaterThan(away.widthPx);

    // Apparent size is inversely proportional to distance.
    expect((near.widthPx * 300) / (mid.widthPx * 500)).toBeCloseTo(1, 1);
  });
});

describe("roll", () => {
  it("matches the head's roll, and only the head's roll", () => {
    for (const roll of [-35, -15, 0, 15, 35]) {
      const { roll: measured } = anchorAt({ roll: degrees(roll) });
      // The eye line runs from A to B, so a head rolled one way puts the
      // measured angle the other; magnitude is what matters here.
      expect(Math.abs(measured), `roll ${roll}deg`).toBeCloseTo(
        Math.abs(degrees(roll)),
        1
      );
    }
  });

  it("stays level through turn alone and tilt alone", () => {
    for (const yaw of [-50, -25, 0, 25, 50]) {
      expect(Math.abs(anchorAt({ yaw: degrees(yaw) }).roll), `yaw ${yaw}`).toBeLessThan(0.02);
    }
    for (const pitch of [-30, -15, 0, 15, 30]) {
      expect(Math.abs(anchorAt({ pitch: degrees(pitch) }).roll), `pitch ${pitch}`).toBeLessThan(0.02);
    }
  });

  it("picks up a modest apparent tilt when turn and tilt combine", () => {
    // Not a defect: a head both turned and tilted really does present a
    // slanted eye line to the camera, and the frame should follow it. What
    // matters is that the amount stays small enough to be plausible.
    const { roll } = anchorAt({ yaw: degrees(-50), pitch: degrees(30) });
    expect(Math.abs(roll)).toBeGreaterThan(0.02);
    expect(Math.abs(roll)).toBeLessThan(0.2);
  });
});

describe("centre", () => {
  it("stays on screen throughout", () => {
    for (const yaw of [-70, -35, 0, 35, 70]) {
      for (const pitch of [-40, 0, 40]) {
        const { center } = anchorAt({ yaw: degrees(yaw), pitch: degrees(pitch) });
        expect(center.x).toBeGreaterThan(0);
        expect(center.x).toBeLessThan(DISPLAY.width);
        expect(center.y).toBeGreaterThan(0);
        expect(center.y).toBeLessThan(DISPLAY.height);
      }
    }
  });

  it("follows the head rather than sitting still", () => {
    const left = anchorAt({ yaw: degrees(-40) });
    const right = anchorAt({ yaw: degrees(40) });
    const up = anchorAt({ pitch: degrees(-30) });
    const down = anchorAt({ pitch: degrees(30) });

    // Turning moves the bridge horizontally, tilting moves it vertically.
    expect(Math.abs(left.center.x - right.center.x)).toBeGreaterThan(1);
    expect(Math.abs(up.center.y - down.center.y)).toBeGreaterThan(1);
  });

  it("mirrors horizontally without moving vertically", () => {
    const pose = { yaw: degrees(30), pitch: degrees(10) };
    const plain = computeFrameAnchor(
      syntheticLandmarks(pose, VIDEO),
      VIDEO,
      DISPLAY,
      false
    )!;
    const mirrored = computeFrameAnchor(
      syntheticLandmarks(pose, VIDEO),
      VIDEO,
      DISPLAY,
      true
    )!;

    expect(mirrored.center.x).toBeCloseTo(DISPLAY.width - plain.center.x, 5);
    expect(mirrored.center.y).toBeCloseTo(plain.center.y, 5);
    expect(mirrored.widthPx).toBeCloseTo(plain.widthPx, 5);
  });
});
