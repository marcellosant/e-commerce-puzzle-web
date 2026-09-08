import * as THREE from "three";

/**
 * Procedural stand-in for the Meridian frame.
 *
 * Built in code rather than loaded from a .glb so the try-on can be developed
 * and calibrated without waiting on a licensed asset, and so the silhouette can
 * be tuned against the product photo directly. Proportions and colours are
 * matched by eye to that photo: an upswept cat-eye in blush acetate, a thin
 * gold inner rim, gradient rose lenses, and slim gold temples.
 *
 * Replacing this with a real model means swapping createMeridianFrame for a
 * GLTFLoader call — nothing downstream depends on how the mesh was produced.
 *
 * Units are metres, sized against a typical adult face: roughly 140mm across.
 */

const BLUSH = 0xe8c4b8;
const GOLD = 0xc9a227;
const LENS = 0x9c7268;

/** Half-width of one lens; the frame spans about four of these plus the bridge. */
const LENS_HALF_W = 0.026;
const LENS_HALF_H = 0.021;
const BRIDGE_HALF_W = 0.009;

/**
 * Outline of one lens as a closed 2D shape, drawn for the right eye and
 * mirrored for the left. The defining feature is the outer top corner, which
 * lifts well above the rest of the rim — that upsweep is what reads as
 * "cat-eye" and is the silhouette's whole identity.
 */
function lensOutline(): THREE.Shape {
  const s = new THREE.Shape();
  const w = LENS_HALF_W;
  const h = LENS_HALF_H;

  // The silhouette is closer to a rounded trapezoid than to a teardrop: broad
  // and near-flat across the top, broad again across the bottom, with only the
  // outer top corner lifted. Control points sit near each chord so the edges
  // stay straight and the curvature collects in the corners.
  s.moveTo(-w * 0.86, h * 0.66);

  // Top edge, rising gently out to the lifted corner.
  s.bezierCurveTo(-w * 0.3, h * 0.92, w * 0.5, h * 1.0, w * 1.04, h * 1.12);

  // Rounded outer corner, then a near-straight descent.
  s.bezierCurveTo(w * 1.1, h * 0.5, w * 0.98, -h * 0.2, w * 0.78, -h * 0.72);

  // Bottom edge: still wide here, not tapering to a point.
  s.bezierCurveTo(w * 0.5, -h * 1.02, -w * 0.2, -h * 1.04, -w * 0.64, -h * 0.76);

  // Nose-side edge, close to vertical, back up to the start.
  s.bezierCurveTo(-w * 0.9, -h * 0.5, -w * 0.96, h * 0.2, -w * 0.86, h * 0.66);

  return s;
}

/** A rim is the outline extruded, with the same outline scaled down as a hole. */
function buildRim(material: THREE.Material, thickness: number): THREE.Mesh {
  const outer = lensOutline();
  const inner = lensOutline();

  // ExtrudeGeometry treats a hole as a path, and scaling the points inward is
  // enough here because the outline is convex where it matters.
  const holePoints = inner.getPoints(64).map((p) => p.multiplyScalar(1 - thickness));
  outer.holes.push(new THREE.Path(holePoints));

  const geometry = new THREE.ExtrudeGeometry(outer, {
    depth: 0.004,
    bevelEnabled: true,
    bevelThickness: 0.0008,
    bevelSize: 0.0008,
    bevelSegments: 2,
    curveSegments: 24,
  });
  geometry.center();

  return new THREE.Mesh(geometry, material);
}

/** The tinted lens that sits inside a rim. */
function buildLens(material: THREE.Material): THREE.Mesh {
  const geometry = new THREE.ExtrudeGeometry(lensOutline(), {
    depth: 0.001,
    bevelEnabled: false,
    curveSegments: 24,
  });
  geometry.center();
  return new THREE.Mesh(geometry, material);
}

/**
 * Builds the frame centred on the bridge, facing +Z, with +X to the wearer's
 * left. Anchoring code can therefore place the group straight onto the nose
 * bridge without correcting for an arbitrary model origin.
 */
export function createMeridianFrame(): THREE.Group {
  const group = new THREE.Group();

  const acetate = new THREE.MeshStandardMaterial({
    color: BLUSH,
    roughness: 0.42,
    metalness: 0.05,
  });

  const gold = new THREE.MeshStandardMaterial({
    color: GOLD,
    roughness: 0.28,
    metalness: 0.85,
  });

  // Tinted enough to read as a real sunglass lens and to stop the far arm
  // showing through it, which it did while these were closer to clear glass.
  // Still open enough that the wearer's eyes come through.
  const lensMaterial = new THREE.MeshPhysicalMaterial({
    color: LENS,
    roughness: 0.12,
    metalness: 0,
    transmission: 0.25,
    thickness: 0.4,
    transparent: true,
    opacity: 0.9,
  });

  const eyeOffset = LENS_HALF_W + BRIDGE_HALF_W;
  const eyes = new THREE.Group();
  group.add(eyes);

  for (const side of [-1, 1] as const) {
    const eye = new THREE.Group();
    // Mirroring the right eye keeps the cat-eye tip pointing outward on both
    // sides without maintaining two outlines.
    eye.scale.x = side;
    eye.position.x = side * eyeOffset;

    eye.add(buildRim(acetate, 0.16));

    // Sits just inside the acetate edge as a fine line, the way the metal
    // detail reads in the product photo — not as a band of its own.
    const innerRim = buildRim(gold, 0.022);
    innerRim.scale.setScalar(0.862);
    innerRim.position.z = 0.0016;
    eye.add(innerRim);

    const lens = buildLens(lensMaterial);
    lens.scale.setScalar(0.88);
    eye.add(lens);

    eyes.add(eye);
  }

  // How wide the frame reads as, measured across the rims alone.
  //
  // The renderer sizes the frame against this rather than against the whole
  // model's bounding box. The box also spans the arms, so it moved every time
  // they were adjusted, silently resizing the frame on the wearer's face and
  // needing the fit recalibrated each time. The rims are what a wearer sees
  // and judges the fit by, so they are what it is scaled to.
  group.userData.frontWidth = new THREE.Box3()
    .setFromObject(eyes)
    .getSize(new THREE.Vector3()).x;

  // Bridge: a slim bar joining the two rims, sitting high like in the photo.
  const bridge = new THREE.Mesh(
    new THREE.BoxGeometry(BRIDGE_HALF_W * 2.6, 0.0022, 0.0035),
    gold
  );
  bridge.position.set(0, LENS_HALF_H * 0.18, 0);
  group.add(bridge);

  // Temples: the arms running back from the hinges toward the ears.
  //
  // Full length, which is only viable because the renderer now puts a
  // depth-writing head behind the frame: most of an arm's length is inside the
  // head's silhouette, and it is the occluder that cuts it off there. Without
  // one these had to be stubs, or they drew as long bars across hair and ears.
  for (const side of [-1, 1] as const) {
    const temple = new THREE.Mesh(
      new THREE.BoxGeometry(0.0032, 0.0062, 0.112),
      gold
    );
    temple.position.set(
      side * (eyeOffset + LENS_HALF_W * 0.98),
      LENS_HALF_H * 0.42,
      -0.056
    );
    // Angled in toward the head and dropping toward the ear.
    temple.rotation.y = side * 0.13;
    temple.rotation.x = -0.16;
    group.add(temple);
  }

  return group;
}
