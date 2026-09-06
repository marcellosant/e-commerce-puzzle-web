"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FaceLandmarker } from "@mediapipe/tasks-vision";

export type LandmarkerStatus = "idle" | "loading" | "ready" | "error";

/**
 * Where the WASM runtime and the detection model are fetched from.
 *
 * These are the only third-party requests the try-on makes, and they carry no
 * user data — the camera frames never leave the device. Self-hosting both
 * would remove the dependency entirely and is worth doing before this is
 * treated as production.
 */
const WASM_ROOT =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

/**
 * Loads MediaPipe's face landmarker on demand.
 *
 * The import is dynamic so that neither the WASM glue nor the task runtime is
 * pulled into any bundle but this route's — a shopper who never opens the
 * try-on should never pay for it.
 */
export function useFaceLandmarker() {
  const landmarkerRef = useRef<FaceLandmarker | null>(null);
  const [status, setStatus] = useState<LandmarkerStatus>("idle");

  const load = useCallback(async () => {
    if (landmarkerRef.current) return;
    setStatus("loading");

    try {
      const vision = await import("@mediapipe/tasks-vision");
      const fileset = await vision.FilesetResolver.forVisionTasks(WASM_ROOT);

      landmarkerRef.current = await vision.FaceLandmarker.createFromOptions(
        fileset,
        {
          baseOptions: { modelAssetPath: MODEL_URL, delegate: "GPU" },
          runningMode: "VIDEO",
          numFaces: 1,
          // The 4x4 head pose, which drives the frame's rotation. Without this
          // the glasses would stay flat on and only follow position.
          outputFacialTransformationMatrixes: true,
          outputFaceBlendshapes: false,
        }
      );
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    return () => {
      landmarkerRef.current?.close();
      landmarkerRef.current = null;
    };
  }, []);

  return { landmarkerRef, status, load };
}
