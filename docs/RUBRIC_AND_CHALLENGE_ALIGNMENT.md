# Rubric and Challenge Alignment

This document maps SoilProve directly to the Vibathon rubric and to Problem
#3. It is intentionally specific: every claim points to a file a judge can
open.

---

## Table A — Problem #3 requirement mapping

| Problem #3 requirement                                              | SoilProve implementation                                                                                       | Evidence in repo                                                                                                       |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Bridge existing soil data → actionable field decisions              | Live USDA SDA/SSURGO point query feeds the decision engine; regional fallback when SDA is unavailable          | `src/lib/soil/sda-soil.ts`, `src/app/api/soil/route.ts`, `src/lib/recommendation/index.ts`                             |
| Scientifically credible methodology                                 | MRTN-inspired economic prior + bounded weather/drainage bias; references documented                            | `src/lib/recommendation/nitrogen.ts`, `src/lib/recommendation/mrtn-priors.ts`, `docs/DECISION_ENGINE.md`, `docs/SCIENTIFIC_BASIS.md` |
| Address yield-risk aversion (the real adoption barrier)             | Peer panel of structurally similar fields with documented N reductions and yield outcomes                      | `src/lib/peer/similarity.ts`, `src/app/wizard/step-peer/*`, `docs/PEER_VALIDATION_AND_OUTCOME_LOOP.md`                  |
| Peer-validation layer                                               | Multi-feature weighted similarity (distance, texture, rotation, yield benchmark, OM, drainage)                 | `src/lib/peer/similarity.ts`, `src/data/peer-fields.json`                                                              |
| Transparent workflow (operator can audit the recommendation)        | Methodology page, per-recommendation explanation strings, confidence breakdown, documented prior table          | `src/app/methodology/page.tsx`, `src/lib/recommendation/index.ts`, `src/lib/recommendation/confidence.ts`              |
| Equipment-agnostic outputs                                          | CSV, GeoJSON, PDF, Deere workplan packaging; OEM import guides for non-Deere operators                          | `src/app/api/export/*`, `src/app/api/deere/*`, wizard export step                                                      |
| Savings framing ($15–25/ac potential)                               | Input-cost delta between current rate and recommendation at current prices, explicitly labeled as not-guaranteed | `src/lib/recommendation/savings.ts`, README disclaimer, `docs/REAL_VS_PROTOTYPE.md`                                    |
| Outcome documentation roadmap                                       | Peer-outcome loop scoped: how a production peer network ingests verified outcomes                              | `docs/PEER_VALIDATION_AND_OUTCOME_LOOP.md`, `docs/PHASES.md` (Phase 3D)                                                |

---

## Table B — Rubric mapping

### Impact & Relevance — 40%

**Why SoilProve scores well.** The product is shaped by the actual barrier
the challenge brief names: yield-risk aversion. It does not stop at "compute
a rate" — it builds a trust artifact (transparent math + peer outcomes +
equipment-ready exports) around a credible recommendation, which is what
Problem #3 is actually asking for.

**Files a judge should inspect.**

- `src/app/wizard/` — the six-step wizard, including the dedicated peer-proof
  step.
- `src/lib/recommendation/` — decision engine.
- `src/lib/peer/similarity.ts` — the peer-validation layer.
- `src/app/api/recommendation/route.ts` — server contract.
- `docs/PEER_VALIDATION_AND_OUTCOME_LOOP.md`.

### Demo Quality — 20%

**Why SoilProve scores well.** The wizard defaults to a real Midwest field
(Cape Girardeau County, MO). Live USDA / NASS / NWS data loads on context
entry, so a judge can produce a prescription in well under two minutes
without typing anything. The methodology page, confidence breakdown, peer
panel, and exports are reachable inside a single linear path.

**Files a judge should inspect.**

- `docs/DEMO_WALKTHROUGH.md` — 90-second judge path and 5-minute presentation
  path.
- `src/app/page.tsx` — landing.
- `src/app/wizard/page.tsx` — wizard entrypoint.
- `scripts/verify-flow.mjs` — runnable simulation of the full path.

### Feasibility — 15%

**Why SoilProve scores well.** Live USDA SDA/SSURGO + NASS + NWS are already
wired in with hardened fallbacks; the Deere OAuth + workplan packaging path
is in place; every prototype piece (prior table, peer fixture, weather risk
enum, Deere POST) is isolated behind a clean interface so it can be replaced
without redesigning the app. The verification scripts demonstrate that the
system holds together end-to-end.

**Files a judge should inspect.**

- `src/lib/soil/sda-soil.ts` — live SDA query + fallback.
- `src/app/api/deere/*` — OAuth + workplan packaging.
- `src/lib/recommendation/mrtn-priors.ts` — isolated prior table.
- `scripts/verify-apis.mjs`, `scripts/verify-flow.mjs`, `scripts/verify-engine.mjs`.
- `docs/REAL_VS_PROTOTYPE.md`.

### Innovation — 15%

**Why SoilProve scores well.** The most interesting use of AI for this
problem is *not* prompting a large model to guess a fertilizer rate.
Agronomic decisions are economic, soil-driven, and risk-bounded — they
reward explicit reasoning chains, not free-form generation. SoilProve's
innovation is therefore:

- **Transparent decision intelligence** instead of black-box rate guessing.
  Every recommendation traces back to a price ratio, a documented prior, and
  bounded field-context bias.
- **Evidence retrieval / peer validation** as the trust mechanism rather
  than model output as the trust mechanism.
- **A clean outcome-learning surface** — once verified outcomes accumulate,
  residual learning on top of the economic prior is the natural AI roadmap
  (rather than replacing the prior with a black box).
- **Pragmatic live-data composition** — the recommendation is one composed
  pipeline over four heterogeneous USDA / NWS sources, with consistent
  fallback semantics so the demo is reliable in a hackathon setting and the
  product would be reliable in a rural-connectivity setting.

This is innovation in the *right* shape for agronomy: defensible,
explainable, and structured so AI can extend it where AI actually belongs
(outcome residuals, anomaly detection, similarity ranking) instead of where
it doesn't (silently authoring a rate a farmer will apply at scale).

**Files a judge should inspect.**

- `src/lib/recommendation/nitrogen.ts` and `mrtn-priors.ts`.
- `src/lib/peer/similarity.ts`.
- `docs/DECISION_ENGINE.md` — explicit grounded-vs-heuristic accounting.
- `docs/PEER_VALIDATION_AND_OUTCOME_LOOP.md` — outcome-learning roadmap.

### User Experience — 10%

**Why SoilProve scores well.** Map-first workflow with a sensible default
field. Each step has a single primary affordance. Context is auto-loaded so
the user doesn't have to hunt for values. Plain-English explanation strings
appear with every recommendation. The peer panel surfaces only structurally
relevant fields. Exports are one click. The methodology page exists for the
sceptical user who wants to read the math before trusting it.

**Files a judge should inspect.**

- `src/app/wizard/*` — wizard UX.
- `src/components/landing/` — landing visual language.
- `src/app/methodology/page.tsx`.
- `docs/DEMO_WALKTHROUGH.md`.

---

## Innovation defense (deeper)

A short list of things SoilProve deliberately does **not** do, and why those
absences are themselves part of the innovation thesis:

- **No LLM rate prediction.** A model that emits an N rate cannot defend its
  number to an agronomist, and "vibes-based agronomy" is exactly the failure
  mode farmers are right to distrust.
- **No fabricated peer outcomes.** The peer fixture is labeled synthetic;
  the production peer network is scoped as a verified-outcome database, not
  a hallucinated one.
- **No fake confidence intervals.** Confidence in the UI is a transparent
  composite score over data availability, not a faked statistical interval.
  Calibrated uncertainty lives in the production roadmap, not the demo.
- **No claim of yield protection.** The savings figure is an input-cost
  delta; the docs and disclaimer say so.

Each absence is a deliberate decision to make the system survivable under
real-world scrutiny — which is the only kind of innovation that matters in
this domain.
