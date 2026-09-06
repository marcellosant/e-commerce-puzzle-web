"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CameraStatus =
  | "idle"
  | "starting"
  | "ready"
  | "denied"
  | "unsupported"
  | "error";

/**
 * Owns the front-facing camera stream for the try-on view.
 *
 * Stopping every track on unmount matters more than usual here: a stream left
 * running keeps the device's camera indicator lit after the user has navigated
 * away, which reads as the site spying on them.
 */
export function useCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<CameraStatus>("idle");

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("unsupported");
      return;
    }

    setStatus("starting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          // Modest resolution on purpose: landmark detection plus rendering
          // every frame is the bottleneck on mid-range phones, and a larger
          // frame buys no accuracy here.
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus("ready");
    } catch (error) {
      const name = error instanceof DOMException ? error.name : "";
      setStatus(
        name === "NotAllowedError" || name === "SecurityError"
          ? "denied"
          : "error"
      );
    }
  }, []);

  useEffect(() => stop, [stop]);

  return { videoRef, status, start, stop };
}
