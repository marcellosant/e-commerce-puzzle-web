"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createMeridianFrame } from "@/lib/tryon/meridian-model";

/**
 * Renders the frame over the camera feed.
 *
 * Kept deliberately dumb: it owns the renderer, the lights and the frame mesh,
 * and exposes nothing about how the frame is positioned. Face tracking drives
 * it from the outside, so the scene can be inspected on its own — which is how
 * the silhouette was matched against the product photo before tracking existed.
 */
export function TryOnScene() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    // Capping at 2 keeps the pixel count sane on phones that report 3x or more,
    // where the extra density costs frame rate and buys nothing visible.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 10);
    camera.position.z = 0.32;

    scene.add(new THREE.AmbientLight(0xffffff, 1.6));

    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(0.4, 0.6, 1);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xffffff, 0.8);
    fill.position.set(-0.6, -0.2, 0.6);
    scene.add(fill);

    const frame = createMeridianFrame();
    scene.add(frame);

    function resize() {
      const { clientWidth, clientHeight } = canvas!;
      if (clientWidth === 0 || clientHeight === 0) return;
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    }

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    let raf = 0;
    function tick() {
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    }
    tick();

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      // Meshes and materials hold GPU memory that isn't reclaimed by GC alone.
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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
