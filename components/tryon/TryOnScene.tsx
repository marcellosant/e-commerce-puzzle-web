"use client";

import { useEffect, type RefObject } from "react";
import * as THREE from "three";
import type { FaceLandmarker } from "@mediapipe/tasks-vision";
import { createMeridianFrame } from "@/lib/tryon/meridian-model";
import {
  computeFrameAnchor,
  rotationFromPoseMatrix,
  smoothAngleTowards,
  smoothTowards,
  type Landmark,
} from "@/lib/tryon/face-anchor";
import { syntheticLandmarks, type HeadPose } from "@/lib/tryon/synthetic-face";

/** The video is mirrored in CSS, so the overlay is mirrored to match. */
const MIRRORED = true;

/**
 * Development-only hook for driving the frame from a synthetic head.
 *
 * The try-on can otherwise only be seen in front of a working camera, which
 * this project's tooling has no access to. Setting a pose here renders the
 * frame at that pose with no camera and no detector, which makes the geometry
 * inspectable across the full range of head movement rather than only at
 * whatever angles a person happens to hold while testing on a phone.
 *
 * Compiled out of production builds.
 */
const MOCK_ENABLED = process.env.NODE_ENV !== "production";

declare global {
  interface Window {
    __puzzleTryOnPose?: HeadPose | null;
  }
}

function readMockPose(): HeadPose | null {
  if (!MOCK_ENABLED || typeof window === "undefined") return null;
  return window.__puzzleTryOnPose ?? null;
}

/**
 * The head rotation the mock stands in for, in the detector's matrix form.
 *
 * Reports the head's true rotation and nothing else, exactly as the detector
 * does. Compensating for the renderer's mirroring here would be wrong twice
 * over: the landmarks are mirrored too, so pre-flipping the rotation leaves
 * the frame facing one way and the face it sits on facing the other.
 */
function mockPoseRotation(
  pose: HeadPose,
  euler: THREE.Euler,
  quaternion: THREE.Quaternion,
  scratch: THREE.Matrix4
): number[] {
  euler.set(pose.pitch ?? 0, pose.yaw ?? 0, pose.roll ?? 0, "YXZ");
  quaternion.setFromEuler(euler);
  return scratch.makeRotationFromQuaternion(quaternion).toArray();
}

/**
 * How quickly the frame chases the face, as a fraction of the gap closed per
 * second. High enough that it doesn't lag behind a turn, low enough that
 * per-frame landmark jitter doesn't read as trembling.
 */
const POSITION_RESPONSIVENESS = 22;
const SCALE_RESPONSIVENESS = 14;
const ROTATION_RESPONSIVENESS = 18;

/**
 * The frame is rendered under perspective rather than orthographically.
 *
 * Orthographic projection has no foreshortening, so a turned head produced a
 * frame that stayed the same width and read as a flat sticker pasted over the
 * face. Perspective makes the far lens recede and the near temple grow, which
 * is most of what sells it as an object sitting on a head.
 *
 * The camera sits a fixed distance from the plane the frame is placed on, so
 * pixels convert to world units by one constant — placement stays driven by
 * landmarks, with no need to match whatever intrinsics the detector assumed.
 */
const CAMERA_FOV_DEGREES = 45;
const CAMERA_DISTANCE = 1;

/**
 * A stand-in head, in metres, that writes depth without drawing anything.

/**
 * A stand-in head, in metres, that writes depth without drawing anything.
 *
 * Whatever falls behind it is discarded by the depth test, which is what stops
 * the far lens and the far arm being painted over the cheek on a turn. It is a
 * plain ellipsoid rather than a mesh built from the landmarks: the face's exact
 * surface barely matters here, only that something roughly head-shaped and
 * head-sized sits in the right place.
 *
 * Carried as a child of the frame so it inherits position, rotation and scale
 * for free — the frame is already fitted to the face, so the head fitted to the
 * frame is fitted to the face too.
 *
 * The depth is deliberately short of a real skull's so the front surface sits
 * just behind the lenses. Erring the other way would swallow the frame itself.
 */
const HEAD_RADII: readonly [number, number, number] = [0.075, 0.105, 0.085];
const HEAD_CENTRE: readonly [number, number, number] = [0, -0.03, -0.09];

/** Draw the occluder instead of hiding it, to check its placement. */
const SHOW_OCCLUDER = false;

interface TryOnSceneProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  landmarkerRef: RefObject<FaceLandmarker | null>;
}

export function TryOnScene({ videoRef, landmarkerRef }: TryOnSceneProps) {
  useEffect(() => {
    const canvas = document.getElementById("tryon-canvas") as HTMLCanvasElement;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    // Capping at 2 keeps the pixel count sane on phones reporting 3x or more,
    // where the extra density costs frame rate and buys nothing visible.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(CAMERA_FOV_DEGREES, 1, 0.01, 100);
    camera.position.z = CAMERA_DISTANCE;

    // World units spanned by one CSS pixel on the plane the frame sits on.
    // Recomputed on resize; everything downstream works in pixels and converts
    // through this, so the landmark-driven placement is unchanged by the move
    // to perspective.
    let worldPerPixel = 0;

    scene.add(new THREE.AmbientLight(0xffffff, 1.6));
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(0.4, 0.6, 1);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0.8);
    fill.position.set(-0.6, -0.2, 0.6);
    scene.add(fill);

    const frame = createMeridianFrame();
    frame.visible = false;
    scene.add(frame);

    // The model is built in metres; placement is in pixels. The frame reports
    // the width of its rims, which is what a wearer judges the fit by — a
    // bounding box would also span the arms and the occluding head, neither of
    // which should have any bearing on how wide the frame is drawn.
    const modelWidth = frame.userData.frontWidth as number;

    const occluder = new THREE.Mesh(
      new THREE.SphereGeometry(1, 24, 16),
      new THREE.MeshBasicMaterial({
        // Writes depth, paints nothing: the camera feed shows through where the
        // head is, while the frame behind it is culled.
        colorWrite: SHOW_OCCLUDER,
        color: 0x224466,
        wireframe: SHOW_OCCLUDER,
      })
    );
    occluder.scale.set(...HEAD_RADII);
    occluder.position.set(...HEAD_CENTRE);
    // Ahead of the frame so its depth is already laid down when the frame draws.
    occluder.renderOrder = -1;
    frame.add(occluder);

    let displayWidth = 0;
    let displayHeight = 0;

    function resize() {
      const { clientWidth, clientHeight } = canvas;
      if (clientWidth === 0 || clientHeight === 0) return;
      displayWidth = clientWidth;
      displayHeight = clientHeight;
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();

      // Height of the view frustum where the frame sits, divided by the pixels
      // covering it.
      const visibleHeight =
        2 * CAMERA_DISTANCE * Math.tan((CAMERA_FOV_DEGREES * Math.PI) / 360);
      worldPerPixel = visibleHeight / clientHeight;
    }

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    // Smoothed state, so each frame eases toward the detection rather than
    // snapping to it.
    const smoothed = { x: 0, y: 0, scale: 0, roll: 0, initialised: false };
    const targetQuaternion = new THREE.Quaternion();
    const poseMatrix = new THREE.Matrix4();

    const mockEuler = new THREE.Euler();
    const mockQuaternion = new THREE.Quaternion();

    /**
     * Places the frame from one detection.
     *
     * Split out from the loop so the same path can be driven by the synthetic
     * head in development, which is the only way to check the geometry across
     * the full range of head movement without a person in front of a camera.
     */
    function applyDetection(
      landmarks: Landmark[],
      videoSize: { width: number; height: number },
      poseRotation: number[] | null,
      delta: number
    ) {
      const anchor = computeFrameAnchor(
        landmarks,
        videoSize,
        { width: displayWidth, height: displayHeight },
        MIRRORED
      );
      if (!anchor) return;

      // Display pixels are top-left origin with y down; the scene is centre
      // origin with y up, in world units.
      const targetX = (anchor.center.x - displayWidth / 2) * worldPerPixel;
      const targetY = (displayHeight / 2 - anchor.center.y) * worldPerPixel;
      const targetScale = (anchor.widthPx * worldPerPixel) / modelWidth;

      if (!smoothed.initialised) {
        smoothed.x = targetX;
        smoothed.y = targetY;
        smoothed.scale = targetScale;
        smoothed.roll = -anchor.roll;
        smoothed.initialised = true;
        frame.visible = true;
      } else {
        smoothed.x = smoothTowards(smoothed.x, targetX, POSITION_RESPONSIVENESS, delta);
        smoothed.y = smoothTowards(smoothed.y, targetY, POSITION_RESPONSIVENESS, delta);
        smoothed.scale = smoothTowards(smoothed.scale, targetScale, SCALE_RESPONSIVENESS, delta);
        smoothed.roll = smoothAngleTowards(smoothed.roll, -anchor.roll, ROTATION_RESPONSIVENESS, delta);
      }

      // Full head orientation when the detector provides it, so the frame
      // turns with the head rather than staying face-on. Falls back to the
      // in-plane tilt read straight from the eye line.
      if (poseRotation) {
        poseMatrix.fromArray(poseRotation);
        targetQuaternion.setFromRotationMatrix(poseMatrix);
        if (MIRRORED) {
          // Reflecting the scene across X reverses the sense of any rotation
          // about Y and Z.
          targetQuaternion.set(
            targetQuaternion.x,
            -targetQuaternion.y,
            -targetQuaternion.z,
            targetQuaternion.w
          );
        }
        frame.quaternion.slerp(
          targetQuaternion,
          1 - Math.exp(-ROTATION_RESPONSIVENESS * delta)
        );
      } else {
        frame.rotation.set(0, 0, smoothed.roll);
      }
    }

    function loseFace() {
      // Hide rather than leave the frame stranded, and forget the smoothing so
      // it doesn't slide in from a stale spot when a face returns.
      frame.visible = false;
      smoothed.initialised = false;
    }

    let raf = 0;
    let lastVideoTime = -1;
    let lastFrameTime = performance.now();

    function tick() {
      raf = requestAnimationFrame(tick);

      const now = performance.now();
      const delta = Math.min((now - lastFrameTime) / 1000, 0.1);
      lastFrameTime = now;

      const mock = readMockPose();

      if (mock && displayWidth > 0) {
        const videoSize = { width: displayWidth, height: displayHeight };
        applyDetection(
          syntheticLandmarks(mock, videoSize),
          videoSize,
          mockPoseRotation(mock, mockEuler, mockQuaternion, poseMatrix),
          delta
        );
      } else {
        const video = videoRef.current;
        const landmarker = landmarkerRef.current;

        if (
          video &&
          landmarker &&
          video.readyState >= 2 &&
          video.videoWidth > 0 &&
          displayWidth > 0
        ) {
          // Detection is keyed on the video clock: rendering can outpace the
          // camera, and re-running the model on a frame already seen is pure
          // cost.
          if (video.currentTime !== lastVideoTime) {
            lastVideoTime = video.currentTime;
            const result = landmarker.detectForVideo(video, now);
            const landmarks = result.faceLandmarks?.[0];

            if (landmarks) {
              const pose = result.facialTransformationMatrixes?.[0]?.data;
              applyDetection(
                landmarks,
                { width: video.videoWidth, height: video.videoHeight },
                pose ? rotationFromPoseMatrix(Array.from(pose)) : null,
                delta
              );
            } else {
              loseFace();
            }
          }
        }
      }

      if (smoothed.initialised) {
        frame.position.set(smoothed.x, smoothed.y, 0);
        frame.scale.setScalar(smoothed.scale);
      }

      renderer.render(scene, camera);
    }

    tick();

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      // Meshes and materials hold GPU memory that GC alone doesn't reclaim.
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const material = object.material;
          if (Array.isArray(material)) material.forEach((m) => m.dispose());
          else material.dispose();
        }
      });
      renderer.dispose();
    };
  }, [videoRef, landmarkerRef]);

  return (
    <canvas
      id="tryon-canvas"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
