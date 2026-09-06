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
} from "@/lib/tryon/face-anchor";

/** The video is mirrored in CSS, so the overlay is mirrored to match. */
const MIRRORED = true;

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

    // The model is built in metres; placement is in pixels. Measuring the mesh
    // once gives the conversion, and keeps it correct if the geometry changes.
    const modelWidth = new THREE.Box3().setFromObject(frame).getSize(
      new THREE.Vector3()
    ).x;

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

    let raf = 0;
    let lastVideoTime = -1;
    let lastFrameTime = performance.now();

    function tick() {
      raf = requestAnimationFrame(tick);

      const now = performance.now();
      const delta = Math.min((now - lastFrameTime) / 1000, 0.1);
      lastFrameTime = now;

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
        // camera, and re-running the model on a frame already seen is pure cost.
        if (video.currentTime !== lastVideoTime) {
          lastVideoTime = video.currentTime;
          const result = landmarker.detectForVideo(video, now);
          const landmarks = result.faceLandmarks?.[0];

          if (landmarks) {
            const anchor = computeFrameAnchor(
              landmarks,
              { width: video.videoWidth, height: video.videoHeight },
              { width: displayWidth, height: displayHeight },
              MIRRORED
            );

            if (anchor) {
              // Display pixels are top-left origin with y down; the scene is
              // centre origin with y up, in world units.
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

              // Full head orientation when the detector provides it, so the
              // frame turns with the head rather than staying face-on. Falls
              // back to the in-plane tilt read straight from the eye line.
              const pose = result.facialTransformationMatrixes?.[0]?.data;
              const rotation = pose
                ? rotationFromPoseMatrix(Array.from(pose))
                : null;

              if (rotation) {
                poseMatrix.fromArray(rotation);
                targetQuaternion.setFromRotationMatrix(poseMatrix);
                if (MIRRORED) {
                  // Reflecting the scene across X reverses the sense of any
                  // rotation about Y and Z.
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
          } else {
            // No face in shot: hide rather than leave the frame stranded, and
            // forget the smoothing so it doesn't slide in from a stale spot.
            frame.visible = false;
            smoothed.initialised = false;
          }
        }

        if (smoothed.initialised) {
          frame.position.set(smoothed.x, smoothed.y, 0);
          frame.scale.setScalar(smoothed.scale);
        }
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
