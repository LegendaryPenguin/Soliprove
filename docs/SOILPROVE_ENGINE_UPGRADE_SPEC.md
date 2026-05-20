# SoilProve Engine Upgrade Implementation Spec

## Mission
Upgrade SoilProve's backend from a polished hackathon demo with a loose nitrogen heuristic into a more serious, scientifically grounded proof-of-concept decision engine that could plausibly serve as the foundation of a real business, while preserving the deployed app's UI, UX, six-step wizard flow, result cards, peer-proof flow, exports, map behavior, and user-visible experience exactly as they are today.

This is not a redesign. This is not a full agronomy platform rebuild. This is a surgical backend upgrade beneath the existing app.

---

## Absolute non-negotiables

Do **not** change any of the following:

- UI or UX
- Six-step wizard flow
- Page layouts
- React component structure unless a tiny internal compatibility change is unavoidable
- Buttons, maps, cards, result layout, peer-proof layout, export layout, or visible visual hierarchy
- User-facing form inputs
- Landing page or methodology page layout
- Auth, database, billing, dashboards, saved fields, or new workflows
- Existing API response shapes consumed by the frontend unless a backward-compatible enrichment is strictly necessary
- Existing Recommendation shape:
  - `nRate`
  - `p2o5Rate`
  - `k2oRate`
  - `savingsPerAcre`
  - `totalSavings`
  - `confidenceScore`
  - `confidenceLabel`
  - `confidenceBreakdown`
  - `explanation`
  - `zones`
- Existing P/K logic
- Existing savings calculation output contract
- Existing peer proof UI / data flow
- Existing export flow
- Existing zone rendering / geometry flow

The app should look and flow the same before and after this work.

---

## Current codebase facts to respect

### Recommendation path
- `POST /api/recommendation` calls `buildRecommendation()`.
- `buildRecommendation()` lives in:
  - `src/lib/recommendation/index.ts`
- `buildRecommendation()` calls `recommendNitrogen()`.
- `recommendNitrogen()` lives in:
  - `src/lib/recommendation/nitrogen.ts`

### Current nitrogen engine
The existing `recommendNitrogen()` is a lightweight heuristic:
- state base rate
- corn-after-corn bump
- price-ratio deductions
- organic-matter deduction
- wet/dry weather nudges
- clamped return around base rate

This is serviceable for a demo but not as defensible as it could be.

### Existing upstream values already available
Inside `buildRecommendation()`, the code already has access to:
- `field.state`
- `input.rotation`
- `input.cornPricePerBu`
- nitrogen price per lb N via `nitrogenPricePerLbFromFarmer(input)`
- `weatherRiskFromProfile(field)`
- `field.soil?.drainageClass`

The drainage class is currently available upstream but not used by `recommendNitrogen()`.

### Soil route
- Current soil endpoint:
  - `src/app/api/soil/route.ts`
- It currently returns structured regional fallback soil values and explicitly notes that SDA precision is not yet connected.
- The response shape is already consumed by the UI and must be preserved.

---

## Product posture and scientific honesty

SoilProve should remain honest:

- It is a hackathon proof of concept, not a certified agronomic calculator.
- It should not claim exact field-optimal nitrogen rates.
- It should not imply calibrated yield-loss probabilities.
- The existing public methodology language already says SoilProve is **"MRTN-inspired"**, not an exact replication of the official Corn Nitrogen Rate Calculator. Preserve that posture.
- Prototype prior-table values and risk-bias coefficients are transparent demonstration heuristics, not official agronomic coefficients.

The major improvement is the **architecture**:

> price ratio → prototype MRTN-style economic prior/range → bounded field-context positioning within that range

This is substantially more defensible than the current ad hoc state-baseline nudges.

---

# Part 1 — Add a prototype MRTN-style prior table

## File to add
- `src/lib/recommendation/mrtn-priors.ts`

## Types
Define:

```ts
export type PriceBand = "low" | "mid" | "high";

export type MrtnPrior = {
  state: string;
  rotation: FarmerInput["rotation"];
  priceBand: PriceBand;
  mrtnRate: number;
  profitableLow: number;
  profitableHigh: number;
  note?: string;
};
```

Import `FarmerInput` from `@/types`.

## Helper functions
Add:

```ts
export function classifyPriceBand(priceRatio: number): PriceBand;

export function getMrtnPrior(
  state: string,
  rotation: FarmerInput["rotation"],
  priceRatio: number
): MrtnPrior;
```

## Price-band heuristic
Use:
- `low` when `priceRatio < 0.10`
- `mid` when `0.10 <= priceRatio < 0.16`
- `high` when `priceRatio >= 0.16`

Add a concise code comment:

> These price bands are transparent prototype bins for the hackathon implementation, used to select embedded MRTN-style priors. A production implementation should replace these with validated agronomic lookup data or a licensed/direct calculator dataset.

## Prior table coverage
Include at minimum:
- `MO`
- `IL`
- `IA`
- `IN`
- `DEFAULT`

For every state block, include:
- both rotations:
  - `corn_after_soybean`
  - `corn_after_corn`
- all three price bands:
  - `low`
  - `mid`
  - `high`

## Prior calibration guidance
Use the current app's state base-rate behavior as a continuity anchor, **not** as a claim of official MRTN output:
- IL base currently 168
- IA base currently 165
- IN base currently 162
- MO base currently 168
- DEFAULT base currently 165

Use this pattern:
- LOW price band: center approximately equal to the existing baseline for continuity
- MID price band: center modestly lower
- HIGH price band: center materially lower
- corn-after-corn should remain meaningfully higher than corn-after-soybean, similar in spirit to the current +25 behavior
- `profitableLow < mrtnRate < profitableHigh` for every prior
- ranges should be modest and plausible for a demo, not absurdly wide

## Documentation comments in the prior table
Add comments making clear:
- these are **prototype MRTN-style priors**
- they preserve current demo behavior while moving the engine closer to a real economic-range architecture
- they are intentionally isolated for later replacement by more validated prior tables or direct agronomic services

---

# Part 2 — Replace the nitrogen engine

## File to modify
- `src/lib/recommendation/nitrogen.ts`

## Exports that must remain available
Keep these exports working:
- `recommendNitrogen()`
- `nitrogenPricePerLbFromFarmer()`
- `weatherRiskFromProfile()`

If `getBaseMRTNLikeRate()` becomes obsolete and nothing else references it, remove it cleanly. If it is temporarily retained, do not use it in the new recommendation path.

## NitrogenInput change
Extend `NitrogenInput` minimally:

```ts
drainageClass?: string;
```

Keep existing fields:
- `state`
- `rotation`
- `cornPricePerBu`
- `nitrogenPricePerLb`
- `organicMatter?`
- `weatherRisk?`

## New `recommendNitrogen()` algorithm
Implement exactly this flow:

### 1. Compute price ratio
```ts
const priceRatio = input.nitrogenPricePerLb / input.cornPricePerBu;
```

### 2. Retrieve prototype prior
```ts
const prior = getMrtnPrior(input.state, input.rotation, priceRatio);
```

### 3. Extract range
```ts
const L = prior.profitableLow;
const M = prior.mrtnRate;
const H = prior.profitableHigh;
```

### 4. Compute weather bias
- `wet_spring` => `+0.20`
- `dry` => `-0.10`
- `normal` or undefined => `0`

### 5. Compute drainage bias
Use `input.drainageClass?.toLowerCase()`.

**Ordering matters** so that `somewhat poorly drained` does not match the broader `poorly` condition first.

Bias rules:
- includes `"somewhat poorly"` => `+0.08`
- includes `"very poorly"` => `+0.15`
- includes `"poorly"` => `+0.15`
- includes `"moderately well"` => `0`
- includes `"well drained"` => `0`
- undefined / unknown => `0`

### 6. Total prototype decision-policy bias
```ts
let bias = weatherBias + drainageBias;
```

### 7. Clamp bias
```ts
bias = clamp(bias, -0.35, 0.35);
```

### 8. Position recommendation inside the profitable range
If `bias >= 0`:
```ts
rate = M + bias * (H - M);
```
Else:
```ts
rate = M + bias * (M - L);
```

### 9. Return integer rate within range
- Use `Math.round(rate)` to preserve the current integer output style.
- Clamp final returned value to `[L, H]`.

### 10. Organic matter behavior
Do **not** keep the current hardcoded automatic OM deduction as a silent rate subtraction unless there is a clear and explicit reason to preserve it. The preferred implementation is:
- keep `organicMatter` in the type for backward compatibility if needed
- do not use SSURGO/demo OM to directly subtract a fixed nitrogen amount in the improved decision path

The improved engine should focus on:
- economics
- prior/range selection
- bounded weather/drainage risk positioning

### 11. Preserve existing supporting helpers
- Keep `nitrogenPricePerLbFromFarmer()` unchanged.
- Keep `weatherRiskFromProfile()` unchanged unless a tiny type/internal fix is required.

---

# Part 3 — Pass drainage into the nitrogen engine

## File to modify
- `src/lib/recommendation/index.ts`

Inside the existing `recommendNitrogen()` call, add:

```ts
drainageClass: field.soil?.drainageClass,
```

Do **not** change:
- P/K logic
- savings logic
- zone-rate multipliers
- confidence calculation
- recommendation response structure
- UI-bound data shape

## Explanation strings
Prefer leaving the existing `explanation` array largely unchanged to avoid visible copy changes.

Only make the smallest wording edit if absolutely necessary to prevent an inaccurate statement.

---

# Part 4 — Make `/api/soil` closer to real without breaking the demo

## Current file
- `src/app/api/soil/route.ts`

## Current response shape to preserve
The route currently returns:
- `mapUnitKey`
- `mapUnitName`
- `soilSeries`
- `texture`
- `slope`
- `drainageClass`
- `hydrologicGroup`
- `availableWaterCapacity`
- `organicMatterEstimate`
- `confidence`
- `lat`
- `lon`
- `source`
- `live`
- `dataAsOf`
- `note`

Do not break that shape.

## File to add
- `src/lib/soil/sda-soil.ts`

## Live USDA SDA/SSURGO helper
Implement a best-effort helper such as:

```ts
fetchSdaSoilContext(lat: number, lon: number)
```

## Design requirements
1. Encapsulate all live Soil Data Access logic in this helper file.
2. Keep `/api/soil/route.ts` clean:
   - parse lat/lon
   - try live SDA helper
   - if it returns a complete usable soil object, return that
   - if it throws, times out, or yields unusable data, return the exact current regional fallback behavior
3. Preserve current route response key names exactly.
4. Preserve graceful fallback; the demo must never break because USDA service is unavailable.
5. Use a reasonable timeout.
6. Do not overbuild polygon support here because the current route receives lat/lon, not a full boundary. A reliable point-based SDA enrichment is acceptable and meaningfully closer to real implementation.
7. If live retrieval succeeds, return as many of these fields as can be supported reliably:
   - map unit key/name
   - soil series or component name if available
   - drainage class
   - hydrologic group
   - available water capacity if reasonably retrievable
   - organic matter estimate if reasonably retrievable
   - confidence high/medium only if appropriate
   - `live: true`
   - current source compatibility
   - note indicating successful live USDA SDA/SSURGO enrichment
8. If any field is not reliably obtainable through a concise stable query, do not invent it. Either leave it absent where compatible or fall back cleanly.
9. If live integration proves brittle, still build a clean helper abstraction and route wiring so the production path is obvious, while keeping flawless fallback behavior.
10. Do not modify the Field Context UI.

---

# Part 5 — Add serious internal documentation

## File to add
- `docs/DECISION_ENGINE.md`

This document should explain:
1. The previous N engine in brief:
   - state baseline + threshold nudges
2. The new N engine:
   - convert product price to $/lb N
   - compute price ratio
   - select prototype MRTN-style prior
   - retrieve profitable low / center / high
   - apply bounded weather/drainage bias
   - position final rate inside the range
3. Exact formulas used
4. Why this is more defensible than the old heuristic
5. Which coefficients are grounded in general agronomic logic vs transparent hackathon heuristic choices
6. Production follow-ups:
   - validated prior tables / direct calculator dataset
   - CDL crop-history inference
   - true rainfall anomaly modeling
   - field outcome database
   - stronger validation layer

## File to add
- `docs/SCIENTIFIC_BASIS.md`

This document should include direct links and concise summaries of what each supports:

1. MRTN / price ratio / profitable range:
   - https://www.cornnratecalc.org/about
   - https://www.cornnratecalc.org/

2. Dynamic N decisions depend on management, weather, location, previous crop, precipitation, and prices:
   - https://crops.extension.iastate.edu/users-guide-n-fact-nitrogen-fertilizer-application-consultation-tool

3. Drainage/rainfall as field-scale context:
   - https://www.canr.msu.edu/news/site-specific-corn-nitrogen-management

4. Risk-aware decision framing:
   - https://arxiv.org/abs/2208.04840

5. SSURGO/SDA soil-context legitimacy:
   - https://www.nrcs.usda.gov/resources/data-and-reports/soil-survey-geographic-database-ssurgo
   - https://sdmdataaccess.sc.egov.usda.gov/
   - https://nasis.sc.egov.usda.gov/NasisReportsWebSite/limsreport.aspx?report_name=SDA-GIS_intersect

Include a **Scientific honesty** section explaining:
- SoilProve is not yet a certified agronomic calculator
- prototype prior values are not official MRTN outputs
- bias coefficients are transparent heuristics
- live soil enrichment improves field context but does not make the model exact

Include a **Why this is still a strong business foundation** section explaining:
- the engine architecture now aligns more closely with real agronomic decision-support logic
- the isolated prior table and soil-provider abstraction can be replaced by more validated sources later without redesigning the app

---

# Part 6 — Preserve demo behavior

The default Cape Girardeau demo should remain plausible and should not swing wildly away from the current output.

The new engine may change the default N recommendation modestly, but the app should still preserve the current demo's savings story and visual coherence.

Do not degrade:
- result step
- peer proof step
- export step
- overall feel of the app

---

# Part 7 — Verification

After implementation:

1. Run:
```bash
npm run build
```

2. Run:
```bash
npm run verify
```

3. Fix:
- type errors
- import errors
- bad route responses
- verify-script failures
- build blockers

Do not stop until:
- build passes
- verify passes

or until you can clearly identify a genuinely external upstream-service failure while confirming the fallback path still works.

---

# Part 8 — Final report

At completion, report:
1. Files added
2. Files modified
3. What the old nitrogen engine did
4. What the new nitrogen engine does
5. Whether live SDA/SSURGO soil enrichment was implemented successfully, or whether the helper/fallback architecture was created but live reliability remained limited
6. The current default Cape Girardeau demo recommendation after the change
7. Build status
8. Verify status
9. Remaining production follow-ups

---

# Success criteria

- The app looks exactly the same.
- The app flows exactly the same.
- The current deployed experience would not feel redesigned.
- The nitrogen engine is materially more defensible and structured.
- Soil context is closer to real implementation when feasible, with safe fallback.
- The codebase now contains serious internal documentation explaining the scientific rationale and prototype boundaries.
- No scope creep.
- No broken build.
