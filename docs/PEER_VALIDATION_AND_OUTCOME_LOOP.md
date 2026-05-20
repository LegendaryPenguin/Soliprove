# Peer Validation and the Outcome Loop

Peer validation is the load-bearing idea in SoilProve. Problem #3 names it
explicitly, and the artifact pack identifies yield-risk aversion as the
primary adoption barrier. This document explains why the peer panel exists,
how it works in the current build, and what a production peer network looks
like.

---

## 1. Why peer validation is the adoption mechanism

A correctly computed N rate, on its own, is not enough to move a farmer off
flat-rate fertilization. The expected-value math is decisively against
unilateral rate cuts unless the operator has a concrete reason to believe
the downside doesn't apply to a field like theirs. That concrete reason — in
the format growers actually use — looks like:

> "Three operators within 30 miles, on similar soil and rotation, cut N by
> 18–22 lb/ac last season and didn't lose yield."

Numbers and confidence scores don't deliver that reassurance. Peers do.
Peer validation is the **only** mechanism that converts a defensible rate
into a defensibly *adopted* rate. That's why SoilProve gives peer proof its
own wizard step rather than tucking it into a sidebar.

## 2. How the current peer matcher works

The matcher lives in `src/lib/peer/similarity.ts`. For each peer field in
the fixture, it produces a weighted similarity score across six signals:

| Signal               | Weight | Why it matters                                        |
| -------------------- | ------ | ----------------------------------------------------- |
| Distance (miles)     | 0.20   | Local agronomy is the most legible to a grower        |
| Soil texture         | 0.25   | Highest-weight structural similarity signal           |
| Rotation             | 0.20   | Corn-after-corn behaves very differently than rotated |
| Yield benchmark      | 0.15   | Aligns peer outcomes to comparable yield ceilings     |
| Organic matter %     | 0.10   | Mineralization potential and water-holding proxy      |
| Drainage class       | 0.10   | Wet-year risk and N-loss exposure                     |

Scores are bucketed (`>= 0.75 high`, `>= 0.55 medium`, else `low`), the top
N peers surface, and the panel aggregates average N reduction, average
yield change, and average savings across the matched peers. Each peer
carries a documented outcome label (`+1 bu/ac`, `no loss reported`, etc.)
that mirrors how a grower would describe it in conversation.

The matcher is intentionally interpretable. A grower (or their CCA) can
point at any peer in the panel and ask "why this one?" — and the answer is
the six similarity components, not a model embedding.

## 3. What the current peer data is

The current peer set is a **synthetic fixture** at
`src/data/peer-fields.json`. It is shaped to reflect plausible Midwest
fields (Cape Girardeau / Champaign County and surrounding regions) so the
similarity matcher exercises every code path, but it does not represent
real farmer outcomes and is **not** presented as such anywhere in the
product, the documentation, or the disclaimer.

The fixture exists to prove the validation layer's *architecture* —
similarity scoring, aggregate confidence, and the wizard step — works end
to end against a defensible structure. Replacing the fixture with real
outcomes is a data swap, not a redesign.

## 4. How a production peer network would work

The production outcome loop is the part of SoilProve that compounds into a
defensible business. The mechanics:

1. **Prescription is generated.** An operator runs the wizard and receives
   a recommendation with documented inputs (soil context, rotation, prices,
   current rates, weather risk).
2. **Actual rates applied.** The operator records what they actually
   applied — which may differ from the recommendation — via a lightweight
   post-prescription form or an integration with their farm management
   software.
3. **Harvest outcomes documented.** After harvest, the operator (or their
   integrated yield monitor / co-op record) reports realized yield by
   zone or by field, plus any qualitative notes (lodging, weather events,
   replant).
4. **Savings and yield change compared.** The system computes the realized
   delta between the prior-year baseline and the executed prescription —
   in input cost, in yield, and in net partial return.
5. **Anonymized outcome records added.** With explicit opt-in, the record
   joins the peer-outcome database at county-level (or finer) grain.
   Personally identifiable details are stripped at ingest.
6. **Future peer proof becomes stronger.** The next operator's peer panel
   draws from a verified-outcome corpus rather than a fixture. Similarity
   ranking can shift from hand-tuned weights to data-driven feature
   weights as the corpus grows.

A short, deliberate set of guarantees governs the loop:

- **Opt-in.** No outcomes are collected without explicit consent.
- **Anonymization at ingest.** Geo precision is degraded to county-level
  (or coarser) before storage.
- **Synthetic-vs-real badging.** Once the database goes live, peers carry
  a badge indicating whether they came from the fixture or from a verified
  outcome. Mixed sets are allowed but always labeled.
- **No fabricated outcomes.** Ever.

## 5. Why this directly answers Problem #3

Problem #3 explicitly names "leveraging social proof from neighboring farms"
as the means by which farmers gain "the confidence necessary for farmers to
transition from traditional flat-rate applications to data-driven, precise
management." The peer panel + outcome loop is the literal implementation of
that requirement:

- Neighboring farms → distance-weighted similarity.
- Social proof → outcome-labeled peers in the wizard step.
- Confidence → an aggregate panel a grower can show their adviser.
- Transition from flat-rate → recommendation + peer proof + equipment-ready
  exports.

## 6. Why this creates business defensibility

Software-only fertilizer calculators commoditize fast. Verified, opt-in,
peer-outcome data does not. As the database grows:

- **Per-recommendation confidence rises**, because more comparable peers
  exist for any given field.
- **Geographic moat compounds.** A peer database with density in Cape
  Girardeau County is more useful in Cape Girardeau County than any
  competitor's national average.
- **AI extension becomes legitimate.** Outcome residuals on top of the
  economic prior are a defensible application of ML — not "guess a rate,"
  but "estimate the residual between prior and realized outcome at this
  field's similarity neighborhood."

The peer-outcome database, plus distribution through agronomist / retailer
partnerships, is the real product. The wizard, the engine, and the exports
are how that product gets adopted in the first place.

---

## References in the repo

- `src/lib/peer/similarity.ts` — matcher implementation.
- `src/data/peer-fields.json` — synthetic fixture.
- `src/data/README.md` — provenance note on what the fixture is and isn't.
- `src/app/api/peer-match/route.ts` — server contract.
- `docs/PHASES.md` — Phase 3D scope of the real peer network.
