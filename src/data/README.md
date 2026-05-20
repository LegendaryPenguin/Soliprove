# src/data

## peer-fields.json

A **synthetic fixture** of peer fields used by the peer-validation layer
(`src/lib/peer/similarity.ts`). Each record carries the structural
attributes the matcher needs (distance, soil texture, drainage, rotation,
yield benchmark, organic matter) plus a documented outcome (N reduction,
yield change, savings).

This file exists to exercise the matcher end-to-end and to let a judge see
the peer-proof step working against a defensible structure. **No record
here represents a real farmer outcome**, and nothing in the product or the
documentation claims otherwise.

In production, this fixture is replaced by an opt-in, anonymized,
verified-outcome database (county-grain or finer). The matcher contract is
unchanged — the upgrade is a data swap, not a redesign. See
`docs/PEER_VALIDATION_AND_OUTCOME_LOOP.md` for the production peer-outcome
loop.
