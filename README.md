# Puzzle — Eyewear

A minimalist editorial storefront for an eyewear brand, built with the Next.js App Router.
Browse the collection, filter and search frames, try a pair on through your phone's camera,
save favourites, and run through a multi-step checkout — in English or Portuguese.

> **Demo project.** The brand is invented, product data is hard-coded, photography is stock,
> and the checkout is simulated — no payment is processed and no order is persisted.
> See [Current limitations](#current-limitations).

## Features

- **Home** — hero slideshow, category grid, curated frames
- **Collection** — filter by category, frame shape, colour and material; search by name; paginated
- **Product detail** — image gallery, colour variants, specifications, add to bag
- **Virtual try-on** — see a frame on your face in 3D, tracked live through the camera. See [below](#virtual-try-on)
- **Cart** — adjust quantities, remove lines, running subtotal
- **Checkout** — three steps (contact → address → payment) with per-step validation and an order confirmation
- **Favourites** — saved frames, persisted in the browser
- **Bilingual** — EN/PT toggle in the header, persisted across visits
- **Accessible** — skip link, labelled controls, inline form errors wired to their inputs, `prefers-reduced-motion` respected

## Tech stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| 3D | Three.js |
| Face tracking | MediaPipe Face Landmarker |
| Icons | lucide-react |
| Tests | Vitest |
| CI | GitHub Actions |

## Getting started

Requires Node.js 20+.

```bash
npm install
```

```bash
npm run dev
```

Then open <http://localhost:3000>.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run the unit test suite once |
| `npm run test:watch` | Run tests in watch mode |

## Project structure

```
app/            Routes (App Router) — home, collection, product, try-on, cart, checkout, favourites
components/     UI, grouped by feature (cart, checkout, collection, home, pdp, tryon, layout, ui)
context/        React contexts — cart, favourites, locale (all persisted to localStorage)
lib/            Pure logic — product data, filters, validation, orders, i18n, try-on geometry
types/          Shared TypeScript types
```

Business logic lives in `lib/` as pure functions so it can be unit-tested without
rendering components. `app/` and `components/` stay thin.

[`docs/HANDOVER.md`](docs/HANDOVER.md) carries what this file does not: the
reasoning behind the non-obvious decisions, the things that look like bugs and
are not, and the ones that break quietly. Read it before changing the try-on.

## Virtual try-on

Open a frame that supports it — Meridian — and the product page offers a try-on. On a
phone it opens straight away; on desktop it shows a QR code instead, because a phone's
front camera is better placed for this than a laptop webcam.

Everything runs on the device. MediaPipe finds the face, and a frame modelled in Three.js
is placed on it: position from the bridge of the nose, size from the span between the eye
corners, orientation from the head pose. **Camera frames are never uploaded.**

Two decisions worth knowing about:

- **Size comes from the 3D distance between the eye corners, not the on-screen one.** The
  on-screen distance collapses as the head turns, which made the frame shrink whenever the
  wearer looked away.
- **An invisible ellipsoid sits behind the frame and writes depth.** Without it the far
  lens and the far arm were painted across the cheek on a turn. It is why the arms can be
  full length rather than stubs.

Which frames offer it is driven by a `tryOn` flag in `lib/data.ts`, so adding another is a
matter of giving it a model — nothing is keyed to a particular product.

## Internationalisation

All UI copy lives in `lib/i18n/dictionaries.ts` (one typed dictionary per locale).
Catalogue terms — category names, frame shapes, materials, colours, and product
descriptions — are translated in `lib/i18n/catalog.ts`.

Colour and shape values stay canonical English internally so filtering keeps working;
translation happens at display time only. Product names are intentionally left untranslated.

To add a locale: extend the `Locale` union, add a dictionary, and add the locale's
column to the catalogue maps. TypeScript will flag every string you still owe.

Because both languages share one URL, and the locale is a client-side preference, page
metadata and link previews are always English.

## Testing

```bash
npm test
```

Unit tests cover checkout validation, collection filtering and search, order resolution,
price formatting, and the i18n catalogue.

The try-on is tested against a synthetic head: known landmarks on a rigid model, projected
for any pose on demand. It sweeps the placement across the full range of turn, tilt and
roll, which is otherwise only checkable by standing in front of a camera pulling faces.
`TryOnScene` also reads a development-only pose hook, so the frame can be rendered at a
chosen angle with no camera at all; it compiles out of production builds.

CI runs lint, tests, and a production build on every push and pull request to `main`.

## Current limitations

These are deliberate, and the natural next steps for the project:

- **Photography is stock.** Every image is Unsplash, chosen as a coherent set — product
  alone, plain light background, similar framing — rather than as real product
  photography, which does not exist because the brand does not. The attributes follow the
  photographs: shape, material and colours describe what is pictured. Replacing them means
  swapping the `stockPhoto(...)` calls in `lib/data.ts`.
- **Try-on covers one frame, and the head it hides behind is an ellipsoid.** The frame is
  built in code rather than loaded from a model, so the silhouette could be matched to the
  product photo without sourcing an asset. The occluder is not the face's real surface, so
  it is approximate around the nose. MediaPipe's runtime and model are also fetched from a
  CDN; self-hosting them would remove the only third-party requests the app makes.
- **No payment processing.** The payment step validates card *formatting* only and is
  clearly labelled as a demo. Nothing is charged, and card details are never transmitted
  anywhere. Wiring a real provider would replace this step entirely.
- **No backend.** Products are hard-coded in `lib/data.ts`; cart, favourites, and locale live
  in `localStorage`. Orders are not persisted — the confirmation screen holds the only copy.
  A cart started on a phone does not follow the shopper back to their desktop.
- **No accounts.** There is no profile or order history. The design brief places
  Profile in the mobile bottom navigation; since account management needs a backend,
  v1.0 gives that slot to the cart instead and defers Profile to v2.0.
- **Stock is static.** One product is flagged `Sold Out` to exercise the state, but
  there is no inventory — an item already in a cart stays purchasable.
