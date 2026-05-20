# SoilProve Decision Engine

This document describes the nitrogen decision engine that powers
`POST /api/recommendation` and lives in `src/lib/recommendation/`. P and K
logic, savings calculation, zone geometry, peer matching, confidence scoring,
and the recommendation response shape are intentionally out of scope.

SoilProve is a hackathon proof-of-concept and is presented as
**MRTN-inspired**, not as an official replication of the Iowa State / Corn
Belt Maximum Return To Nitrogen (MRTN) calculator. See
[`SCIENTIFIC_BASIS.md`](./SCIENTIFIC_BASIS.md) for primary references.

---

## 1. The previous engine (legacy)

The legacy nitrogen engine was a lightweight ad hoc heuristic in
`src/lib/recommendation/nitrogen.ts`:

1. Look up a state baseline (e.g. IL 168, IA 165, IN 162, MO 168, default 165).
2. Add **+25 lb/ac** for `corn_after_corn`.
3. Subtract **10–20 lb/ac** when the N:corn price ratio crossed simple
   thresholds (`> 0.15`, `> 0.20`).
4. Subtract **8 lb/ac** when organic matter exceeded 4%.
5. Apply small wet/dry weather nudges (±5–8 lb/ac).
6. Clamp the final value to `baseline ± 35`.

This was serviceable for a demo but had two structural weaknesses:

- It centered every decision on a fixed state number rather than on the local
  economics of N application, so the same N would be recommended at radically
  different price ratios until a hard threshold was crossed.
- It applied each adjustment as an additive lb/ac nudge with no notion of a
  "profitable range," so the output had no honest interval associated with it.

---

## 2. The new engine (current)

The new engine still produces a single integer `nRate` (the recommendation
contract is unchanged for the UI), but it derives that number from an
explicit economic prior plus a bounded field-context bias.

```
priceRatio   = nitrogenPricePerLb / cornPricePerBu
prior        = getMrtnPrior(state, rotation, priceRatio)   // {L, M, H}
weatherBias  = +0.20 wet_spring | -0.10 dry | 0 otherwise
drainageBias = +0.15 (very) poorly | +0.08 somewhat poorly | 0 otherwise
bias         = clamp(weatherBias + drainageBias, -0.35, +0.35)
rate         = bias >= 0
                 ? M + bias * (H - M)
                 : M + bias * (M - L)
nRate        = clamp(round(rate), L, H)
```

Where `prior = { profitableLow: L, mrtnRate: M, profitableHigh: H }` is
selected from a small table keyed by `(state × rotation × priceBand)` in
`src/lib/recommendation/mrtn-priors.ts`.

### Price bands

```
priceRatio  <  0.10   → low
0.10 ≤ rat  <  0.16   → mid
priceRatio  ≥  0.16   → high
```

These bands are transparent prototype bins. A production deployment should
replace them with validated agronomic lookup data or a licensed/direct
calculator dataset.

### Prior table

The prior table is calibrated so that:

- The **low** band center ≈ the previous engine's state baseline (continuity
  anchor — the deployed demo keeps its visual numbers).
- The **mid** band center is modestly lower than the low band.
- The **high** band center is materially lower than the low band.
- `corn_after_corn` centers sit ~25 lb above `corn_after_soybean`, preserving
  the spirit of the legacy rotation bump.
- Every prior satisfies `L < M < H` with modest, plausible widths.

States included: `IL`, `IA`, `IN`, `MO`, `DEFAULT` (fallback for any other
state). All combinations of rotation × price band are covered.

### Bias coefficients

| Signal               | Bias    | Rationale                                             |
| -------------------- | ------- | ----------------------------------------------------- |
| `wet_spring` weather | `+0.20` | Wetter springs raise denitrification / leaching risk. |
| `dry` weather        | `-0.10` | Drought reduces yield ceiling and N response.         |
| `somewhat poorly` drained | `+0.08` | Modest excess-water risk.                        |
| `poorly`/`very poorly` drained | `+0.15` | Substantial excess-water risk.              |
| Well / moderately well drained | `0` | No bias.                                       |

The total bias is clamped to `[-0.35, +0.35]` so the recommendation can never
exit the profitable range, and the magnitude of any adjustment is interpreted
as a fraction of the half-range on the relevant side of `M`.

### Organic matter

The previous engine subtracted a flat 8 lb/ac when OM > 4%. The new engine
does **not** apply a silent OM deduction in the decision path. OM remains in
the `NitrogenInput` type for backward compatibility, but the engine now
focuses on economics, prior/range selection, and bounded weather/drainage
risk positioning. OM mineralization estimates belong in a future, more
defensible accounting layer.

---

## 3. Why this is more defensible than the legacy heuristic

1. **Economics first.** The recommendation now starts from `priceRatio` and a
   range that conceptually represents "rates inside which expected partial
   return is acceptable." This matches how MRTN-style calculators frame the
   decision in the field.
2. **Bounded by an honest range.** Field-context adjustments are positioned
   inside `[L, H]` rather than emitted as unbounded lb/ac nudges. The model
   cannot recommend a rate outside the profitable interval it just selected.
3. **Separation of concerns.** The prior table is isolated in its own file
   so it can be replaced by a validated dataset (or a direct call to a
   licensed calculator) without touching the decision algorithm.
4. **Explicit price-band logic.** Pricing thresholds are explicit and
   documented rather than buried in `if` statements.
5. **Drainage is in the loop.** SSURGO-derived drainage is now a first-class
   signal instead of being ignored downstream of `/api/soil`.

---

## 4. Grounded vs heuristic coefficients

- **Grounded in general agronomic logic:**
  - Direction of every bias (wet/poorly drained → push up; dry → push down).
  - Direction of the rotation bump (`corn_after_corn` > `corn_after_soybean`).
  - Direction of price-band shifts (higher N:corn ratio → lower economic
    optimum).

- **Transparent hackathon heuristics — not official agronomic coefficients:**
  - The numeric magnitudes of each bias (`+0.20`, `+0.15`, etc.).
  - The price-band cutoffs (`0.10`, `0.16`).
  - The exact center and width of every prior in the table.

These are documented inline in
`src/lib/recommendation/mrtn-priors.ts` and
`src/lib/recommendation/nitrogen.ts`.

---

## 5. Production follow-ups

To take this from a credible proof-of-concept to a production decision-
support service, the natural next steps are:

1. **Validated prior tables / direct calculator dataset.** Replace
   `mrtn-priors.ts` with a sourced agronomic dataset (e.g. a direct
   integration with the public Corn Nitrogen Rate Calculator or a licensed
   variant), broken out by sub-state region where the underlying science
   warrants it.
2. **CDL crop-history inference.** Use USDA Cropland Data Layer history at
   the drawn boundary to verify the user-provided rotation rather than
   trusting the form input.
3. **True rainfall anomaly modeling.** Replace the three-state weather risk
   enum with a percentile-based recent rainfall anomaly (e.g. PRISM /
   gridMET) feeding a calibrated weather bias.
4. **Field outcome database.** Persist post-season yield / applied-N
   outcomes so the engine can learn empirical residuals on top of the
   economic prior.
5. **Stronger validation layer.** Tighten the Zod schemas around recommended
   ranges, surface confidence intervals to the UI, and gate exports behind
   plausibility checks.
6. **Polygon-based SSURGO enrichment.** Move from point-based SDA to a
   polygon intersect that returns the dominant-component soil profile per
   management zone, not just the field centroid.
