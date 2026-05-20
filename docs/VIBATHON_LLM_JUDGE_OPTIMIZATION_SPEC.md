# SoilProve Vibathon LLM Judge Optimization Spec

## Mission

Optimize the SoilProve repository so that an LLM judge reviewing the codebase under the Vibathon rubric concludes:

1. This project directly and deeply solves Problem #3.
2. The team understood the real problem: yield-risk aversion blocks action on existing soil data.
3. The product is technically substantive, scientifically disciplined, and pilotable.
4. The business thesis is coherent and strongly grounded in the original artifact pack.
5. The codebase is unusually clear, honest, and well-verified for a hackathon submission.

This is a **repo optimization pass**, not a product rebuild.

---

# Rubric to optimize against

## Impact & Relevance — 40%
Does it effectively solve the problem presented?

## Demo Quality — 20%
Can you clearly show what it does and how it works?

## Feasibility — 15%
Could this actually be piloted in the real world?

## Innovation — 15%
Is the approach creative and making strong use of AI?

## User Experience — 10%
Is it clear and accessible to end users?

---

# Problem #3 brief to optimize against

This challenge focuses on bridging the gap between existing soil data and actionable field decisions for corn farmers in the Midwest. Participants are tasked with building a tool that uses scientifically credible methodologies to generate field-specific fertilizer prescriptions while addressing the primary barrier of yield-risk aversion through a peer-validation layer. The objective is to create a transparent, equipment-agnostic solution that allows operators to optimize their fertilizer spend—potentially saving $15–25 per acre—without sacrificing yield. By documenting real-world outcomes and leveraging social proof from neighboring farms, the solution aims to provide the confidence necessary for farmers to transition from traditional flat-rate applications to data-driven, precise management.

---

# Absolute constraints

Do not:
- change the six-step wizard flow
- redesign UI or UX
- alter layouts, styling, cards, map flow, export flow, or result layout
- add auth, DB, billing, new product features, or risky integrations
- overclaim scientific certainty
- fabricate real peer outcomes
- claim current prototype priors are official MRTN values
- claim yield protection is guaranteed

Allowed:
- rewrite README/docs
- add new docs
- add root-level judge guide
- update stale methodology text only for factual accuracy
- update stale phase/status docs
- add non-invasive verification script(s)
- update package.json verify command to include new checks
- add small explanatory comments in peer-related code/data if helpful

---

# Current repo strengths that must be amplified

The repository already includes:
- polished map-first 6-step wizard
- live/fallback soil context via SDA/SSURGO helper
- price-aware prototype MRTN-style nitrogen engine
- P/K estimates
- savings calculation
- peer similarity matcher
- export routes for CSV / GeoJSON / PDF
- John Deere packaging path
- internal science docs
- end-to-end verification scripts

The optimization pass should make these strengths impossible to miss.

---

# Required additions

## 1. Add root-level `JUDGE_START_HERE.md`

Purpose:
A concise judge-facing entrypoint for a human or LLM reviewer.

Required sections:
1. What Problem #3 is really asking
2. SoilProve’s answer in one paragraph
3. Why the project matters
4. How it satisfies the rubric
5. What is live vs prototype
6. Where to look in the repo
7. Why SoilProve deliberately uses transparent decision intelligence instead of black-box agronomic hallucination
8. Links to:
   - README.md
   - docs/RUBRIC_AND_CHALLENGE_ALIGNMENT.md
   - docs/DECISION_ENGINE.md
   - docs/SCIENTIFIC_BASIS.md
   - docs/REAL_VS_PROTOTYPE.md
   - docs/PEER_VALIDATION_AND_OUTCOME_LOOP.md
   - docs/DEMO_WALKTHROUGH.md

Tone:
- confident
- concise
- evidence-forward
- not hypey

---

## 2. Rewrite `README.md`

Transform the README from a generic developer README into the main judging front door.

Required structure:
1. Title + thesis:
   SoilProve turns existing soil and field context into explainable fertilizer prescriptions for Midwest corn farmers, addressing the actual adoption bottleneck: yield-risk aversion.
2. Live demo section:
   Include deployed URL placeholder/reference if already present in repo context.
3. Challenge fit:
   Explain how SoilProve maps directly to Problem #3:
   - existing soil data → actionable decisions
   - scientifically credible prescriptions
   - peer-validation layer
   - equipment-agnostic exports
   - savings framing
   - outcome-tracking roadmap
4. Six-step flow:
   - Field location
   - Field context
   - Farm inputs
   - Prescription
   - Peer proof
   - Export
5. Why this is not a generic fertilizer calculator:
   - behavioral barrier = yield fear
   - trust stack = science + peer proof + transparent outputs
   - business logic = outcome data compounds defensibility
6. What is live now:
   - live/fallback soil context
   - recommendation API
   - peer matching scaffold
   - exports
   - Deere packaging path
   - verification scripts
7. What is prototype by design:
   - embedded MRTN-style priors
   - synthetic peer dataset
   - coarse weather risk categories
   - point-based soil lookup rather than polygon aggregation
   - Deere packaging path rather than fully approved production Work Plan POST
8. Technical architecture:
   concise bullet or diagram
9. Judge reading guide:
   link to `JUDGE_START_HERE.md`
10. Scientific basis:
   link to docs
11. Verification:
   `npm run verify`
12. Local setup
13. Disclaimer

Do not make the README bloated or salesy. It should be extremely legible to a judge.

---

## 3. Add `docs/RUBRIC_AND_CHALLENGE_ALIGNMENT.md`

Purpose:
Make the project’s relevance impossible to miss.

Include two tables.

### Table A — Challenge requirement mapping
Columns:
- Problem #3 requirement
- SoilProve implementation
- Evidence in repo

Rows must include:
- bridge existing soil data to field decisions
- scientifically credible methodology
- yield-risk aversion
- peer-validation layer
- transparent workflow
- equipment-agnostic outputs
- savings framing
- outcome documentation roadmap

### Table B — Rubric mapping
Rows:
- Impact & Relevance 40%
- Demo Quality 20%
- Feasibility 15%
- Innovation 15%
- User Experience 10%

For each:
- why SoilProve scores well
- exact repo files a judge should inspect

This document should explicitly defend Innovation:
- no black-box LLM rate guessing
- transparent decision intelligence
- evidence retrieval / peer validation
- future residual learning from verified outcomes

---

## 4. Add `docs/ARTIFACT_SYNTHESIS.md`

Purpose:
Turn the original artifact pack into a crisp product-discovery narrative visible inside the repo.

Use the artifact pack’s major ideas:
- existing soil data is not enough
- farmers fear cutting rates because yield downside dominates
- peer proof is the confidence bridge
- target user is a data-aware, margin-focused operator
- agronomist endorsement and verified outcomes matter
- the business moat is field outcome data + peer validation + trusted distribution

Required sections:
1. The refined problem thesis
2. Primary user/persona
3. Why yield-risk aversion matters
4. Why peer validation is central
5. Why equipment-agnostic export matters but is not the core insight
6. What the artifact pack said about feasibility / viability
7. How the current codebase implements the artifact insights
8. What remains for a post-hackathon pilot

Do not overclaim direct farmer validation if the artifact pack itself noted that desirability is not fully validated.

---

## 5. Add `docs/REAL_VS_PROTOTYPE.md`

Purpose:
Survive scrutiny.

Sections:

### Real / implemented in this build
- six-step app flow
- map/polygon workflow
- live or fallback soil enrichment
- price-aware prototype recommendation engine
- P/K estimation
- savings computation
- peer similarity matcher
- exports
- Deere package route
- automated verification scripts

### Prototype / demo scaffold
- prototype MRTN prior table, not licensed official priors
- synthetic peer outcome fixture, not a real farmer outcome database
- weather risk categories, not calibrated precipitation anomaly model
- centroid point soil enrichment, not polygon-weighted field aggregation
- Deere packaging path, not full production Work Plan POST
- savings are estimated input-cost delta, not guaranteed realized ROI

### Why these tradeoffs are correct for Vibathon
- demonstrate the product thesis end-to-end
- isolate future production replacements cleanly
- avoid pretending unavailable outcomes exist

---

## 6. Add `docs/PEER_VALIDATION_AND_OUTCOME_LOOP.md`

Purpose:
Elevate the most challenge-specific idea.

Required sections:
1. Why peer validation is the adoption mechanism
2. How the current peer matcher works
   - similar fields
   - distance
   - soil texture
   - rotation
   - yield benchmark
   - OM
   - drainage
3. What current peer data is
   - synthetic fixture for proof of concept
4. How a production peer network would work
   - prescriptions generated
   - actual rates applied
   - harvest outcomes documented
   - savings/yield compared
   - anonymized outcome records added
   - future peer proof becomes stronger
5. Why this directly answers Problem #3
6. Why this creates business defensibility

Reference:
- `src/lib/peer/similarity.ts`
- `src/data/peer-fields.json`

---

## 7. Add `docs/DEMO_WALKTHROUGH.md`

Purpose:
Improve Demo Quality.

Include:

### 90-second judge path
- Open home
- Start wizard
- Use default Cape Girardeau field
- Review auto-loaded context
- Leave farm inputs defaults
- Generate prescription
- Observe savings + confidence + zones
- Continue to peer proof
- Export report/files

### 5-minute presentation path
- More narrative
- Why each step matters
- Where live data appears
- What prototype pieces represent

### What to narrate
- “This is not just a calculator”
- “Here is how risk aversion is addressed”
- “Here is where science enters”
- “Here is how operators take action”

---

# Required modifications

## 8. Update `docs/PHASES.md`

Fix stale implementation status.

Specifically:
- update the soil/data status to reflect:
  - point-based live SDA/SSURGO enrichment is now implemented
  - polygon-based SSURGO field/zone enrichment remains future work
- mention the upgraded prototype MRTN-range engine
- mention the addition of internal scientific documentation where appropriate

Do not rewrite the whole file unless necessary.

---

## 9. Update `src/app/methodology/page.tsx`

Change only inaccurate body text in the nitrogen methodology section.

Current old text references:
- regional baseline rates
- organic matter adjustment

Replace it with accurate wording equivalent to:

“Uses MRTN-inspired economics: crop rotation, corn price, nitrogen price, prototype profitable-range priors, and bounded field-context risk positioning from weather/drainage context. We do not claim exact replication of the official Corn Nitrogen Rate Calculator.”

Do not alter layout, card structure, styling, spacing, or other sections unless there is a factual inconsistency.

---

## 10. Refine `docs/DECISION_ENGINE.md`

In the production follow-ups section:

Revise the validation/uncertainty item so it does not imply fake confidence intervals now. Preferred concept:
- tighter validation and plausibility gates now
- calibrated uncertainty intervals only after outcome data or probabilistic modeling supports them

Revise the SSURGO item to:
- polygon-weighted field aggregation first
- zone-level SSURGO enrichment once variable-rate zone logic is agronomically real

Keep the rest intact.

---

## 11. Add `scripts/verify-engine.mjs`

Purpose:
Show the recommendation logic behaves coherently under scrutiny.

The script should call `/api/recommendation` using controlled sample fields/inputs and assert:
1. Higher N price should not increase the recommended N rate for otherwise identical conditions.
2. Corn-after-corn should recommend at least as much N as corn-after-soybean.
3. Wet + poorly drained should recommend at least as much N as dry + well drained, holding other inputs constant.
4. Output should be a valid positive number.
5. Endpoint should still return all expected recommendation fields.

Keep it robust and simple.

---

## 12. Update `package.json`

Change:

```json
"verify": "node scripts/verify-apis.mjs && node scripts/verify-flow.mjs"
```

to:

```json
"verify": "node scripts/verify-apis.mjs && node scripts/verify-flow.mjs && node scripts/verify-engine.mjs"
```

---

## 13. Optional small peer clarity improvement

Add a short top-of-file comment to `src/lib/peer/similarity.ts` or a small `src/data/README.md` explaining:
- the similarity matcher is a proof-of-concept for the peer-validation layer
- the current data source is a synthetic fixture
- production source would be anonymized verified outcomes

Do not change code behavior.

---

# Final verification

After making changes:

1. Run:
```bash
npm run build
```

2. Run:
```bash
npm run verify
```

3. Fix any issues until both pass.

4. Report:
- files added
- files modified
- how each addition improves a rubric category
- build status
- verify status
- any intentional non-changes

---

# Success criteria

A judge reading the repo should be able to answer these questions instantly:

1. What exact problem is SoilProve solving?
2. Why is yield-risk aversion the center of the problem?
3. How does the app convert soil/context into a decision?
4. Why is the prescription scientifically disciplined?
5. How does peer validation reduce adoption risk?
6. What is live now and what is prototype?
7. Could this be piloted?
8. Why is this innovative without being fake-black-box AI?
9. How can the judge verify the system works?
10. Why is this a strong answer to Problem #3?
