# Real vs Prototype

SoilProve is a hackathon submission. Some pieces are production-shaped and
some are intentionally scaffolded. This document is the single source of
truth for which is which, so a judge or a future engineer can scrutinize the
build without guessing.

---

## Real / implemented in this build

- **Six-step wizard** — `src/app/wizard/`. Persisted in `localStorage`,
  Framer Motion transitions, coach tips, reset control.
- **Map / polygon workflow** — React Leaflet + Geoman, satellite tiles,
  draggable pin, polygon draw, GeoJSON upload, address / ZIP search,
  geolocation. Acres computed from the drawn polygon with `@turf/area`.
- **Live or fallback soil enrichment** — `src/lib/soil/sda-soil.ts` calls
  the USDA Soil Data Access REST endpoint with a point intersect against
  the SSURGO `mupolygon` → `mapunit` → `component` → `chorizon` tables.
  When live data is unavailable, the route returns regional defaults with
  the same shape so downstream code does not branch.
- **Price-aware prototype nitrogen engine** — `src/lib/recommendation/nitrogen.ts`
  computes `priceRatio = nitrogenPricePerLb / cornPricePerBu`, selects a
  prototype prior `{ L, M, H }` from `mrtn-priors.ts`, applies a bounded
  weather + drainage bias, and returns a rate clamped inside the
  profitable range.
- **P / K estimation** — `src/lib/recommendation/pk.ts`. Soil-test
  categories and crop-removal / maintenance logic when lab data is
  available; conservative maintenance defaults otherwise.
- **Savings computation** — `src/lib/recommendation/savings.ts`.
  Per-acre and whole-field input-cost delta between the current rate and
  the recommendation at current prices.
- **Confidence breakdown** — `src/lib/recommendation/confidence.ts`.
  Composite over data availability (soil test, USDA soil match, peer
  similarity, weather risk, reduction aggressiveness). Surfaced as a
  transparent score, not a faked statistical interval.
- **Three management zones** — `src/lib/geo/zones.ts`. Wedge geometry
  clipped to the drawn boundary via `@turf/intersect`.
- **Peer similarity matcher** — `src/lib/peer/similarity.ts`. Weighted
  similarity across distance, soil texture, rotation, yield benchmark,
  organic matter, and drainage class.
- **Exports** — CSV, GeoJSON, PDF (`src/app/api/export/*`). PDF uses
  `jspdf` + `jspdf-autotable`.
- **John Deere packaging route** — OAuth start / callback / field list /
  workplan POST endpoint (`src/app/api/deere/*`). The workplan POST
  packages a payload aligned with Deere's Work Plan shape — see the
  prototype note below.
- **Automated verification scripts** — `scripts/verify-apis.mjs`,
  `scripts/verify-flow.mjs`, `scripts/verify-engine.mjs`. Driven from
  `npm run verify`.

## Prototype / demo scaffold

- **Prototype MRTN prior table** (`src/lib/recommendation/mrtn-priors.ts`).
  Hand-calibrated to preserve the legacy demo's visual numbers and to
  satisfy `L < M < H` with plausible widths. These are **not** licensed
  official MRTN outputs and should not be presented as such. The
  production replacement is a sourced agronomic dataset or a direct
  integration with the public Corn Nitrogen Rate Calculator.
- **Synthetic peer outcome fixture** (`src/data/peer-fields.json`). No
  real farmer outcomes claimed. The production peer source is an
  anonymized verified-outcome database, scoped in
  [PEER_VALIDATION_AND_OUTCOME_LOOP.md](PEER_VALIDATION_AND_OUTCOME_LOOP.md).
- **Weather risk categories** — three-state enum
  (`normal | wet_spring | dry`) derived heuristically from NWS drought
  risk and recent rainfall. The production replacement is a
  percentile-based rainfall-anomaly model (PRISM / gridMET) with
  calibrated coefficients.
- **Centroid point soil enrichment** — the SDA call uses the field
  centroid. The production replacement is polygon-weighted aggregation
  of dominant components across the drawn boundary.
- **Deere packaging path** — produces a workplan-shaped payload from the
  recommendation. This is **not** a fully-approved production Work Plan
  POST and should not be presented as such. Token refresh, multi-tenant
  field mapping, and full Work Plan validation are scoped in Phase 3F.
- **Reported "savings"** are the input-cost delta between the user's
  stated current rate and the model's recommended rate at current
  prices. They are **not** a guaranteed realized ROI, and they do not
  imply yield protection. The README and the in-app result view both
  treat this honestly.

## Why these tradeoffs are correct for a Vibathon submission

- **Demonstrate the product thesis end-to-end.** A judge can run the full
  wizard, see live USDA / NASS / NWS data flow into a defensible
  recommendation, see structurally similar peers, and export the result —
  all within a few minutes. That demonstrates that the *shape* of the
  product is right.
- **Isolate future production replacements cleanly.** Each prototype piece
  lives behind a clean interface (`mrtn-priors.ts`, `sda-soil.ts`,
  `peer-fields.json`, the Deere route). Upgrading any one of them is a
  data swap or a route swap, not a redesign.
- **Avoid pretending unavailable data exists.** Faking peer outcomes,
  faking calibrated confidence intervals, or claiming licensed MRTN
  output would make the project look stronger on the surface and weaker
  under scrutiny. We chose the opposite tradeoff deliberately. The
  business case for SoilProve depends on the kind of credibility that
  survives a CCA reading the code.

A judge looking for the boundary between "what's real" and "what's
scaffolded" should always be able to find it in this file.
