# Puzzle — Eyewear

A minimalist editorial storefront for an eyewear brand, built with the Next.js App Router.
Browse the collection, filter and search frames, save favourites, and run through a
multi-step checkout — in English or Portuguese.

> **Demo project.** Product data is hard-coded, photography is temporary Unsplash stock,
> and the checkout is simulated — no payment is processed and no order is persisted.
> See [Current limitations](#current-limitations).

## Features

- **Home** — editorial hero, category grid, curated frames
- **Collection** — filter by category, frame shape, colour and material; search by name; paginated
- **Product detail** — image gallery, colour variants, specifications, add to bag
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
app/            Routes (App Router) — home, collection, product, cart, checkout, favourites, profile
components/     UI, grouped by feature (cart, checkout, collection, pdp, layout, ui)
context/        React contexts — cart, favourites, locale (all persisted to localStorage)
lib/            Pure logic — product data, filters, validation, orders, i18n dictionaries
types/          Shared TypeScript types
```

Business logic lives in `lib/` as pure functions so it can be unit-tested without
rendering components. `app/` and `components/` stay thin.

## Internationalisation

All UI copy lives in `lib/i18n/dictionaries.ts` (one typed dictionary per locale).
Catalogue terms — category names, frame shapes, materials, colours, and product
descriptions — are translated in `lib/i18n/catalog.ts`.

Colour and shape values stay canonical English internally so filtering keeps working;
translation happens at display time only. Product names are intentionally left untranslated.

To add a locale: extend the `Locale` union, add a dictionary, and add the locale's
column to the catalogue maps. TypeScript will flag every string you still owe.

## Testing

```bash
npm test
```

Unit tests cover checkout validation, collection filtering and search, order resolution,
price formatting, and the i18n catalogue. CI runs lint, tests, and a production build on
every push and pull request to `main`.

## Current limitations

These are deliberate, and the natural next steps for the project:

- **Photography is placeholder.** Every product and category image is Unsplash stock, chosen
  to roughly match the product. Replace the `stockPhoto(...)` calls in `lib/data.ts` with
  real photography.
- **No payment processing.** The payment step validates card *formatting* only and is
  clearly labelled as a demo. Nothing is charged, and card details are never transmitted
  anywhere. Wiring a real provider (e.g. Stripe) would replace this step entirely.
- **No backend.** Products are hard-coded in `lib/data.ts`; cart, favourites, and locale live
  in `localStorage`. Orders are not persisted — the confirmation screen holds the only copy.
- **Profile is a stub.** Account management is not implemented.
