# SoilProve

**SoilProve turns existing soil and field context into explainable fertilizer
prescriptions for Midwest corn farmers, addressing the actual adoption
bottleneck: yield-risk aversion.**

A map-first, six-step wizard pulls live USDA soil, county yield, weather, and
price signals, runs them through an MRTN-inspired decision engine, and pairs
the result with a peer panel of structurally similar fields that have already
cut fertilizer without losing yield. Output is exportable to CSV / GeoJSON /
PDF or packaged for John Deere.

If you are a judge, the fastest entrypoint is
**[JUDGE_START_HERE.md](JUDGE_START_HERE.md)**.

---

## Live demo

The deployed build runs as a standard Next.js 16 app. To run locally:

```bash
npm install
npm run dev
# → http://localhost:3000
```

The wizard defaults to **Cape Girardeau County, Missouri** (ZIP `63701`,
`37.3059, -89.5181`) so every demo is one click from a real Midwest field.

---

## Challenge fit (Vibathon Problem #3)

Problem #3 asks for a tool that bridges existing soil data and field-level
decisions, uses **scientifically credible methodology**, includes a
**peer-validation layer** to address yield-risk aversion, supports
**equipment-agnostic outputs**, and frames **fertilizer savings** ($15–25/ac
potential) while documenting **real-world outcomes**.

SoilProve maps directly to that brief:

| Problem #3 requirement                       | SoilProve implementation                                            |
| -------------------------------------------- | ------------------------------------------------------------------- |
| Bridge existing soil data → field decisions  | Live USDA SDA/SSURGO point query feeds the recommendation engine    |
| Scientifically credible methodology          | MRTN-inspired prior + bounded weather/drainage bias, fully documented |
| Address yield-risk aversion                  | Peer panel of structurally similar fields with documented outcomes  |
| Peer-validation layer                        | Multi-feature similarity (distance, texture, rotation, yield, OM, drainage) |
| Transparent workflow                         | Methodology page + decision-engine docs + per-recommendation explanation |
| Equipment-agnostic outputs                   | CSV, GeoJSON, PDF, Deere workplan packaging                         |
| Savings framing                              | Honest input-cost delta vs. current rate, not guaranteed ROI        |
| Outcome-tracking roadmap                     | Peer-outcome loop documented in [PEER_VALIDATION_AND_OUTCOME_LOOP.md](docs/PEER_VALIDATION_AND_OUTCOME_LOOP.md) |

A more detailed rubric mapping lives in
[docs/RUBRIC_AND_CHALLENGE_ALIGNMENT.md](docs/RUBRIC_AND_CHALLENGE_ALIGNMENT.md).

---

## Six-step flow

1. **Field location** — satellite map, draggable pin, polygon draw, GeoJSON
   upload, address/ZIP search, geolocation.
2. **Field context** — auto-loaded USDA soil, NASS yield, NWS weather, regional
   fertilizer prices.
3. **Farm inputs** — rotation, corn / N price, current rates, optional soil
   test or CSV upload.
4. **Prescription** — N / P / K with profitable-range context, savings,
   confidence breakdown, three management zones clipped to the boundary.
5. **Peer proof** — similar nearby fields with documented N reductions and
   yield outcomes.
6. **Export** — CSV, GeoJSON, PDF, Deere workplan packaging, OEM import guides.

---

## Why this is not a generic fertilizer calculator

- **The barrier is behavioral, not informational.** Most Midwest growers
  already have plenty of soil data. What they don't have is the social
  permission to cut a flat rate they've used for a decade. SoilProve treats
  the *trust artifact* — peer outcomes + transparent math + equipment-ready
  exports — as the product, not as decoration around a number.
- **The trust stack is layered:** USDA-sourced science, an explainable
  decision engine with documented coefficients, structurally similar peer
  fields, and outputs the farmer's existing equipment can actually consume.
- **The business logic compounds over time.** Every documented outcome
  strengthens the peer panel; the moat is field-outcome data plus trusted
  distribution, not the calculator itself.

---

## What is live now

- Live USDA SDA/SSURGO point soil enrichment with regional fallback
  (`src/lib/soil/sda-soil.ts`).
- USDA NASS county corn yield benchmark.
- National Weather Service forecast / drought-risk signal.
- Recommendation API end-to-end (`POST /api/recommendation`).
- Peer similarity matcher over a synthetic-but-realistic fixture.
- Exports: CSV, GeoJSON, PDF.
- John Deere OAuth + field list + workplan packaging route.
- End-to-end verification scripts (API, wizard flow, engine invariants).

## What is prototype by design

- **MRTN-style prior table** in `src/lib/recommendation/mrtn-priors.ts` —
  calibrated to preserve demo numbers, not an official MRTN dataset.
- **Synthetic peer outcome fixture** (`src/data/peer-fields.json`) — no real
  farmer outcomes claimed.
- **Three-state weather risk** (`normal | wet_spring | dry`) instead of a
  calibrated rainfall-anomaly model.
- **Point-based soil enrichment** at the field centroid, not polygon-weighted
  aggregation across the drawn boundary.
- **Deere packaging route** — produces an export payload aligned with Deere's
  Work Plan shape, but is not a fully-approved production Work Plan POST.
- **Savings** are the input-cost delta between the current rate and the
  recommendation at current prices — they are **not** guaranteed realized ROI.

Full breakdown in [docs/REAL_VS_PROTOTYPE.md](docs/REAL_VS_PROTOTYPE.md).

---

## Technical architecture

- **Next.js 16** (App Router) + **TypeScript**, **Tailwind**, shadcn-style UI.
- **React Leaflet + Geoman** for the satellite map and polygon draw.
- **Decision engine** (`src/lib/recommendation/`): nitrogen, P/K, savings,
  confidence, zones — pure functions, no model calls.
- **Soil provider** (`src/lib/soil/sda-soil.ts`): live USDA SDA query with
  regional fallback; the contract is the same in both paths so downstream
  code doesn't branch.
- **Peer matcher** (`src/lib/peer/similarity.ts`): weighted similarity over
  distance, soil texture, rotation, yield benchmark, OM, drainage.
- **API routes** under `src/app/api/`: geocode, soil, nass, weather,
  fertilizer-prices, recommendation, peer-match, exports, deere/*.
- **Verification** (`scripts/`): three Node scripts that drive the running app
  end-to-end and assert engine invariants.

---

## Judge reading guide

Start at **[JUDGE_START_HERE.md](JUDGE_START_HERE.md)** for a five-minute
orientation, then jump to whichever doc answers your next question:

- [docs/RUBRIC_AND_CHALLENGE_ALIGNMENT.md](docs/RUBRIC_AND_CHALLENGE_ALIGNMENT.md)
- [docs/ARTIFACT_SYNTHESIS.md](docs/ARTIFACT_SYNTHESIS.md)
- [docs/PEER_VALIDATION_AND_OUTCOME_LOOP.md](docs/PEER_VALIDATION_AND_OUTCOME_LOOP.md)
- [docs/REAL_VS_PROTOTYPE.md](docs/REAL_VS_PROTOTYPE.md)
- [docs/DEMO_WALKTHROUGH.md](docs/DEMO_WALKTHROUGH.md)

## Scientific basis

The decision engine, prior table, and bias coefficients are documented in
[docs/DECISION_ENGINE.md](docs/DECISION_ENGINE.md). Public references that
inform the methodology are collected in
[docs/SCIENTIFIC_BASIS.md](docs/SCIENTIFIC_BASIS.md), including the
Corn Nitrogen Rate Calculator (MRTN), Iowa State N-FACT, MSU's
site-specific-N article, a risk-aware decision-theoretic framing, and the
USDA SSURGO / SDA endpoints.

## Verification

```bash
npm run start    # in one shell
npm run verify   # in another
```

`npm run verify` runs three end-to-end checks:

1. `scripts/verify-apis.mjs` — every API route returns its expected shape.
2. `scripts/verify-flow.mjs` — simulates the full wizard data path.
3. `scripts/verify-engine.mjs` — asserts engine invariants:
   - higher N price never raises the recommended rate
   - corn-after-corn ≥ corn-after-soybean
   - wet + poorly drained ≥ dry + well drained
   - output is a valid positive number with the expected response shape

## Local setup

- Copy `.env.example` to `.env.local` and configure optional integrations
  (`NASS_API_KEY`, Deere keys, etc.).
- Geolocation requires HTTPS in production (automatic on Vercel).
- If you enable Deere, register `https://your-domain.com/api/deere/callback`
  in the Deere developer console.

## API routes

| Route                          | Purpose                                |
| ------------------------------ | -------------------------------------- |
| `POST /api/geocode`            | County / state from lat/lon            |
| `GET /api/geocode/search`      | Census address / ZIP forward geocode   |
| `GET /api/soil`                | SSURGO-style soil context (live + fallback) |
| `GET /api/nass`                | County corn yield                      |
| `GET /api/weather`             | NWS forecast + drought risk            |
| `GET /api/fertilizer-prices`   | Regional fertilizer defaults           |
| `POST /api/recommendation`     | Full prescription                      |
| `POST /api/peer-match`         | Peer similarity matching               |
| `POST /api/export/csv`         | Prescription CSV                       |
| `POST /api/export/geojson`     | Field + zones GeoJSON                  |
| `GET /api/deere/auth`          | John Deere OAuth start                 |
| `GET /api/deere/callback`      | OAuth callback                         |
| `GET /api/deere/fields`        | List Deere fields                      |
| `POST /api/deere/workplan`     | Push prescription payload              |

## Disclaimer

SoilProve is a decision-support tool, not a certified agronomic calculator.
The MRTN-style prior table is a transparent prototype, not licensed official
MRTN output. The peer panel uses a synthetic fixture, not real farmer
outcomes. Final fertilizer decisions should be reviewed with a certified crop
adviser or local extension recommendation. Reported "savings" are an
input-cost delta vs. your stated current rate at current prices — they are
not a guarantee of realized return or yield protection.
