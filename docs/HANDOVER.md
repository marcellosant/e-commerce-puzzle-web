# Handover

Context for whoever works on this next, including a later version of you.

The [README](../README.md) covers what the project is and how to run it. This
covers what it cost to get here: the decisions that are not obvious from the
code, the things that look like bugs and are not, and the things that break
quietly.

Current state: **v1.0.0** tagged on `main`, work continuing on `dev`.

---

## 1. Where things live

| | |
|---|---|
| Repository | `github.com/marcellosant/e-commerce-puzzle-web` |
| Production | `e-commerce-puzzle-web.vercel.app`, deployed from `main` |
| Branches | `main` is released and tagged; `dev` is where work happens |
| CI | GitHub Actions — lint, tests, production build, on push to either branch and on PRs to `main` |

`main` is **not** protected by a ruleset. That was deliberate: the ruleset is
invisible to anyone viewing the repository, and on a solo project it adds
ceremony without protecting against anything. What is visible, and worth
keeping, is the habit — work on `dev`, open one pull request per release. Turn
the ruleset on the moment a second person joins.

### The repository once had the wrong root

`git rev-parse --show-toplevel` originally pointed at `C:\Users\marce` — the
whole home directory was a repository and this project was untracked inside it.
Any `git add -A` from here would have staged unrelated personal files. It now
has its own repository. Worth checking if the project is ever copied elsewhere.

---

## 2. Things that look wrong and are not

**Hydration mismatch warnings naming `bis_skin_checked` or `__processed_<uuid>__`.**
Injected by a browser extension (Bitdefender is the usual source) before React
hydrates. Not an application bug and not fixable from application code —
`suppressHydrationWarning` does not inherit to children, so covering it would
mean adding it to every `div` in the tree. Test in a private window.

**`FrameShape` and `Material` include values no product uses.** They are a
vocabulary, not a manifest. `getFilterFacets` derives the filter options from
the products that exist, so unused values never render as empty filters.

**Three `eslint-disable-next-line react-hooks/set-state-in-effect` in the
contexts.** Reading `localStorage` on mount cannot be done during render, so
this is the one place the pattern is correct. Each is commented. The related
`isHydrated` guard is load-bearing: without it, the persist effect fires before
the hydrate effect and overwrites stored data with an empty array.

**Windows line-ending warnings on every `git add`.** Noise. LF in the working
tree, CRLF on checkout.

---

## 3. The virtual try-on

The most intricate part of the project, and the part most likely to be broken
by a well-meaning change. Everything below was arrived at by fixing something
that was visibly wrong on a real face.

### Why placement is split between two sources

Position and size come from **landmarks**; rotation comes from the **head-pose
matrix**. This is deliberate.

Taking position from the pose matrix's translation would require the render
camera to match the intrinsics the detector assumed. Rotation carries no such
dependency, so it can be used directly whatever the projection is.

### Size must come from the 3D eye span

`computeFrameAnchor` measures the distance between the outer eye corners **in
three dimensions**, not on screen. The on-screen distance collapses as the head
turns — both eyes project toward the same place — which made the frame shrink
whenever the wearer looked away. This was the worst bug in the feature.

The axes arrive normalised differently: `x` and `z` against frame width, `y`
against height. They are put into a common scale before measuring.

### Two transforms that silently misalign the overlay

Both are handled, both will break placement if removed:

- The video is drawn with `object-cover`, so it is scaled up and cropped. The
  overlay repeats that crop (`coverTransform`).
- The video is mirrored for the selfie view. Landmark positions **and the sense
  of rotation** are mirrored to match. Mirroring one without the other leaves
  the frame facing opposite to the face it sits on.

### Perspective, not orthographic

An orthographic camera has no foreshortening, so a turned head kept a
full-width frame and read as a sticker pasted on the face. The camera is
perspective, sitting a fixed distance from the plane the frame occupies, so
pixels still convert to world units by a single constant.

### The occluder

An invisible ellipsoid, roughly head-sized, is a **child of the frame** — it
inherits position, rotation and scale for free, because a frame already fitted
to the face means a head fitted to the frame is fitted to the face.

It writes depth and paints nothing, so whatever falls behind it is discarded.
Without it, the far lens and far arm were painted across the cheek on every
turn, and the arms had to be stubs.

Its depth deliberately **stops short of a real skull's**, so its front surface
sits just behind the lenses. Push it forward and it swallows the frame.

### Scale measures the rims, not the bounding box

`createMeridianFrame` reports `userData.frontWidth`, and the renderer scales
against that. The bounding box also spans the arms and the occluding head, so
scaling against it meant every adjustment to the arms silently resized the
frame on the wearer's face. That happened twice before the cause was found.

**If you change the arms, the frame size will not move. That is the point.**

### Testing it without a camera

`lib/tryon/synthetic-face.ts` projects known landmarks from a rigid head at any
pose, in the shape the detector reports. `placement-sweep.test.ts` sweeps
placement across the full range of turn, tilt and roll.

`TryOnScene` also reads a **development-only** pose hook, compiled out of
production. In the browser console:

```js
window.__puzzleTryOnPose = { yaw: 0.7, pitch: 0, roll: 0, distanceMm: 300 };
```

The frame renders at that pose with no camera and no detector. Set it to `null`
to hand control back. There is also a `SHOW_OCCLUDER` constant in
`TryOnScene.tsx` that draws the occluding head as a wireframe.

Two cautions the harness taught, both mistakes in the harness rather than the
code: the synthetic head must pivot about the **skull**, not the nose bridge,
or the face never moves; and it must report the head's **true** rotation, not a
pre-mirrored one, or the frame and the face face opposite ways.

### What it does not do

- **One frame.** Gated on a `tryOn` flag in `lib/data.ts`, so adding another is
  a matter of giving it a model — nothing is keyed to a product.
- **The frame is built in code**, not loaded from a model, so its silhouette
  could be matched to the product photo without sourcing an asset. Replacing it
  means swapping `createMeridianFrame` for a loader call; nothing downstream
  cares how the mesh was produced.
- **The occluder is an ellipsoid**, not the face's surface. Approximate around
  the nose, which projects further than the cheeks. A mesh built from the
  landmarks would fix it and is the natural next step.
- **MediaPipe's runtime and model are fetched from a CDN** (`jsdelivr` and
  Google storage). These are the only third-party requests the application
  makes. Camera frames never leave the device, and the privacy copy is worded
  to claim exactly that and no more — *"face detection runs on your device"*,
  not *"everything runs on your device"*. **If you self-host these, you may
  strengthen that wording. Until then, do not.**

---

## 4. Other decisions worth knowing

**Both locales share one URL.** The locale is a client-side preference in
`localStorage`, and metadata renders on the server where it is unknown — so
page titles and link previews are **always English**. Fixing that means locale
routing (`/pt`, `/en`), which is a routing refactor, not a translation one.

**Catalogue values stay canonical English internally.** Colours, shapes and
materials are translated at display time only, so filtering keeps working.
Product names are left untranslated on purpose — brand-style naming.

**Photography was chosen as a set, not one at a time.** Product alone, no
people, plain light background, similar framing. An earlier pass picked each
photo for its subject and the result read as a scrapbook.

Because the products do not exist, **the attributes follow the photographs** —
shape, material and colours describe what is pictured. Preserve that direction
when adding products, or the filters start lying.

> **Trap when sourcing photos:** two candidates got as far as the site with a
> rival's branding visible on the lens (Ray-Ban, then Calvin Klein). Check the
> lens and temples at full size before committing one.

Only nine coherent images could be found, so the catalogue is **ten products**
rather than twelve. A contact lens and an eyewear chain were dropped rather
than break the set for them.

**The home page is desaturated at the page level**, not inside the cards. The
same cards stay in colour in the collection, where colour is something you shop
by.

---

## 5. Operational

### Environment

No environment variables are required. Two are read if present:

| Variable | Effect |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Overrides the base for canonical and OG URLs. Set this once a custom domain exists. |
| `VERCEL_PROJECT_PRODUCTION_URL` | Injected by Vercel. The stable production domain. |

`VERCEL_URL` is used only as a last resort and **should not be relied on**: it
is the per-deployment hostname and changes on every push, which pointed
canonical URLs at throwaway addresses until it was demoted.

### The Unsplash API key

A key was used **only to search for photographs during development**. It is not
used at runtime and is in no committed file. It was pasted into the chat, so it
should be rotated at `unsplash.com/oauth/applications`.

`.claude/settings.local.json` is gitignored **because it records approved
commands verbatim**, and one of those commands had the key embedded. Keep it
ignored.

### The lockfile was once corrupt

`npm ci` failed on the Linux CI runner while working locally on Windows.
`lightningcss` — Tailwind v4's CSS engine — was missing its Linux binary.

The cause was not platform-specific optional dependencies, which is the usual
suspect. **286 of 457 lockfile entries had no `resolved` URL or integrity
hash**, inherited from a degraded `create-next-app` run. Without those, npm
cannot fetch anything, and optional platform binaries fail silently.

The fix was to delete `node_modules` **and** `package-lock.json` together and
reinstall. Deleting only one is not enough: npm regenerates from whichever
remains and preserves the damage.

To check: every entry in `packages` should have a `resolved` field.

### Vitest config must be `.mts`

`package.json` has no `"type": "module"`, so a `.ts` config is loaded as
CommonJS and fails on Vitest's pure-ESM dependencies. `vitest.config.mts` is
explicit and needs no change to `package.json`.

---

## 6. Known gaps

Ordered by how likely they are to matter.

| Gap | Notes |
|---|---|
| No backend | Products hard-coded; cart, favourites and locale in `localStorage`. Orders are not persisted — the confirmation screen holds the only copy. |
| No payment | The payment step validates card *formatting* only and is labelled as a demo. Nothing is charged; card details are never transmitted. |
| No accounts | No profile or order history. The brief puts Profile in the mobile bottom navigation; v1.0 gives that slot to the cart instead. |
| Cart does not follow the shopper | Started on a phone via the try-on QR, it does not reach their desktop. Needs accounts or a server-side cart. |
| No inventory | One product is flagged `Sold Out` to exercise the state, but an item already in a cart stays purchasable. |
| Occluder is approximate | See §3. Imprecise around the nose. |
| MediaPipe from CDN | See §3. Self-hosting removes the only third-party requests. |
| Link previews are English only | See §4. Needs locale routing. |
| Colour name under a grey image | On the home page a card shows "Blush" beneath a desaturated photo. Accepted; common enough in practice. |

---

## 7. Common tasks

**Replace a photograph.** Swap the `stockPhoto(...)` call in `lib/data.ts` and
check the attributes still describe what is pictured. Nothing else depends on
where images come from. To host locally instead, put files in `public/` and use
their paths — this also drops the `images.unsplash.com` entry in
`next.config.ts`.

**Add a frame to the try-on.** Set `tryOn: true` on the product and give it a
model. `generateStaticParams` and `generateMetadata` read the same flag, so
frames without it return 404 rather than an empty camera view.

**Add a locale.** Extend the `Locale` union, add a dictionary, and add the
locale's column to the catalogue maps in `lib/i18n/catalog.ts`. TypeScript will
flag every string still owed.

**Tune the try-on fit.** `FRAME_WIDTH_RATIO` in `lib/tryon/face-anchor.ts` is
the frame's width as a multiple of the eye span. The responsiveness constants in
`TryOnScene.tsx` trade lag against jitter. Use the pose hook in §3 rather than a
camera.

**Cut a release.** Open one pull request from `dev` to `main`, let CI run, merge,
bump `package.json`, tag `vX.Y.Z` with an annotated message, push the tag, then
create the release on GitHub — the tag message serves as a draft.
