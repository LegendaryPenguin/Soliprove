# Judge — start here

This is a five-minute orientation for a human or LLM judge reviewing SoilProve
against the Vibathon rubric and Problem #3. The full README, methodology, and
science docs are linked at the bottom.

---

## 1. What Problem #3 is really asking

Problem #3 asks for a tool that bridges **existing soil data** and **actionable
fertilizer decisions** for Midwest corn farmers, using scientifically credible
methodology and a **peer-validation layer** that confronts the real barrier to
adoption: **yield-risk aversion**. The target outcome is a transparent,
equipment-agnostic workflow that lets an operator optimize fertilizer spend
(~$15–25/ac potential) without sacrificing yield, and that documents real-world
outcomes so social proof from neighboring farms compounds over time.

SoilProve was built directly against that brief. Not a generic calculator. Not
a black-box ML rate predictor. A decision support tool whose central job is to
make a farmer feel safe enough to act on data they already have.

## 2. SoilProve's answer in one paragraph

Draw a field, load live USDA soil context, enter your prices and rotation, and
get an explainable nitrogen / P / K prescription with a profitable range, a
confidence score, three management zones clipped to your boundary, and a peer
panel of structurally similar fields that already cut nitrogen without losing
yield — then export to CSV / GeoJSON / PDF or push to John Deere. The
recommendation engine is MRTN-inspired (price ratio in, profitable range out,
bounded weather/drainage bias) and every coefficient is documented and
inspectable. No hallucinated agronomy.

## 3. Why the project matters

- The yield gap between "what soil data suggests" and "what farmers actually
  apply" is mostly **behavioral**, not informational. Solving it requires
  trust artifacts — transparent math, peer outcomes, equipment-ready exports —
  not another rate calculator.
- The architecture is shaped so that every prototype piece (peer fixture,
  prior table, weather risk enum) has a clean production replacement path.
  Pilots can begin without rewriting the wizard, the API contracts, or the UI.
- The savings framing in the UI is honest: it is an **input-cost delta**, not
  a guaranteed ROI, and the docs say so explicitly.

## 4. How it satisfies the rubric

| Rubric                 | Where it shows up                                                  |
| ---------------------- | ------------------------------------------------------------------ |
| Impact & Relevance 40% | Six-step wizard, MRTN-inspired engine, peer panel, exports         |
| Demo Quality 20%       | One-click default field, live data on load, [DEMO_WALKTHROUGH.md](docs/DEMO_WALKTHROUGH.md) |
| Feasibility 15%        | Live SDA/SSURGO + NASS + NWS, Deere packaging path, [REAL_VS_PROTOTYPE.md](docs/REAL_VS_PROTOTYPE.md) |
| Innovation 15%         | Transparent decision intelligence + outcome-driven peer loop       |
| User Experience 10%    | Map-first wizard, plain-English explanations, defaults that work   |

A more detailed mapping lives in [docs/RUBRIC_AND_CHALLENGE_ALIGNMENT.md](docs/RUBRIC_AND_CHALLENGE_ALIGNMENT.md).

## 5. What is live vs prototype

**Live in this build**

- USDA SDA/SSURGO point soil enrichment with regional fallback
- USDA NASS county corn yield benchmark
- National Weather Service forecast / risk
- Recommendation API end-to-end
- Peer similarity matcher
- CSV / GeoJSON / PDF exports
- John Deere OAuth + field list + workplan packaging route
- Verification scripts (`npm run verify`)

**Prototype by design (and documented as such)**

- MRTN-style prior table — calibrated to demo numbers, not official MRTN output
- Synthetic peer outcome fixture (no real farmer outcomes claimed)
- Coarse weather risk categories instead of calibrated rainfall anomaly
- Point-based soil lookup instead of polygon-weighted field aggregation
- Deere packaging route instead of a fully-approved production Work Plan POST
- "Savings" = current-rate-vs-recommended-rate input-cost delta, not realized ROI

[docs/REAL_VS_PROTOTYPE.md](docs/REAL_VS_PROTOTYPE.md) is the single source of
truth for what is and isn't real in this build.

## 6. Where to look in the repo

| Path                                          | What it is                                              |
| --------------------------------------------- | ------------------------------------------------------- |
| `src/app/wizard/`                             | The six-step wizard                                     |
| `src/app/methodology/page.tsx`                | User-facing methodology page                            |
| `src/lib/recommendation/`                     | Decision engine (N, P/K, savings, confidence, zones)    |
| `src/lib/recommendation/mrtn-priors.ts`       | Prototype MRTN-style prior table                        |
| `src/lib/soil/sda-soil.ts`                    | Live USDA SDA/SSURGO point query + fallback             |
| `src/lib/peer/similarity.ts`                  | Peer similarity matcher                                 |
| `src/data/peer-fields.json`                   | Synthetic peer fixture (proof-of-concept)               |
| `src/app/api/`                                | All API routes (recommendation, peer-match, exports…)   |
| `scripts/verify-apis.mjs`                     | End-to-end API verification                             |
| `scripts/verify-flow.mjs`                     | Wizard data-flow simulation                             |
| `scripts/verify-engine.mjs`                   | Engine-logic invariants (price, rotation, drainage)     |

## 7. Why transparent decision intelligence beats black-box LLM agronomy

A judge could reasonably ask: *where's the AI?* The honest answer is that the
most innovative use of AI in this problem space is **not** prompting a model
to guess a fertilizer rate. Agronomic decisions are economic, soil-driven, and
risk-bounded — they reward explicit reasoning chains, not free-form generation.

SoilProve's innovation is shaped accordingly:

- **Transparent decision intelligence.** Every recommendation can be traced
  back to a price ratio, a documented prior, and a bounded bias from
  field-context signals. A farmer (or their crop adviser) can audit it.
- **Evidence retrieval over hallucination.** Peer outcomes are matched on
  structural similarity (distance, soil texture, rotation, yield benchmark,
  organic matter, drainage), not summarized by a model.
- **Outcome learning is the AI roadmap.** Once verified outcomes accumulate,
  the natural next step is residual learning on top of the economic prior —
  not replacing the prior with a black box.

If a farmer cuts 25 lb/ac of nitrogen on the strength of a recommendation, it
matters far more that the recommendation is *defensible* than that it was
*generated by a large model*.

## 8. Links

- [README.md](README.md)
- [docs/RUBRIC_AND_CHALLENGE_ALIGNMENT.md](docs/RUBRIC_AND_CHALLENGE_ALIGNMENT.md)
- [docs/DECISION_ENGINE.md](docs/DECISION_ENGINE.md)
- [docs/SCIENTIFIC_BASIS.md](docs/SCIENTIFIC_BASIS.md)
- [docs/REAL_VS_PROTOTYPE.md](docs/REAL_VS_PROTOTYPE.md)
- [docs/PEER_VALIDATION_AND_OUTCOME_LOOP.md](docs/PEER_VALIDATION_AND_OUTCOME_LOOP.md)
- [docs/DEMO_WALKTHROUGH.md](docs/DEMO_WALKTHROUGH.md)
- [docs/ARTIFACT_SYNTHESIS.md](docs/ARTIFACT_SYNTHESIS.md)
- [docs/PHASES.md](docs/PHASES.md)
