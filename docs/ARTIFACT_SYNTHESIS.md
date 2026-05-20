# Artifact Synthesis

This document distills the discovery work that shaped SoilProve into a single
narrative a judge can read alongside the codebase. It is not a marketing
restatement — it is the product thesis that explains *why the repo looks the
way it does*.

---

## 1. The refined problem thesis

Midwest corn growers already have access to substantial soil and field-level
data. The bottleneck to value capture is not data availability; it is
**adoption**. Flat-rate fertilization persists in fields where soil data
clearly suggests reductions because the downside of a yield miss dominates
the operator's mental model. The unspoken question every grower is asking is
not *"what does the data say?"* — it is *"who else did this, and did their
yield hold?"*

The refined thesis: the highest-leverage product in this space is not a
better rate calculator. It is a **trust artifact** built around a credible
recommendation. The math has to be defensible, the peers have to be real, and
the output has to land in the equipment the operator already runs.

## 2. Primary user / persona

A **data-aware, margin-focused Midwest corn operator** — managing several
hundred to several thousand acres of corn, often in rotation with soybean,
with access to a CCA or independent agronomist. They keep soil-test data,
follow input prices, and have already experimented with VRT or zone
management on at least some acres. They are not technology-averse; they are
**yield-risk averse**. They evaluate a fertilizer change against the worst
defensible outcome, not the average outcome.

Secondary stakeholder: the **certified crop adviser** the operator trusts.
Any recommendation the product produces has to survive being shown to that
adviser without embarrassment.

## 3. Why yield-risk aversion matters

A $20/ac fertilizer saving is dwarfed in expected value by a 5 bu/ac yield
hit at $4.25/bu corn ($21/ac). A grower who internalizes that arithmetic
will rationally refuse to cut rates unless they have **strong evidence the
downside isn't real on a field like theirs**. The implications for the
product:

- A rate alone — however correct — is not persuasive.
- A confidence number alone is not persuasive either; numbers can be
  fabricated and growers know it.
- What persuades is **structurally similar peers who applied the change and
  measured the outcome**. That is the format of the evidence growers
  actually use in conversation.

The wizard reflects this: a dedicated peer-proof step exists between the
prescription and the export. The export does not feel like the finish line;
the peer panel does.

## 4. Why peer validation is central

Three reasons peer validation is the load-bearing idea:

1. **It is the format of trust farmers already use.** Adoption stories in
   row-crop agriculture travel through neighbors, coffee-shop conversations,
   and county-level retailer relationships — not through dashboards.
2. **It is the only mechanism that can address the yield-fear asymmetry.**
   No amount of calculator transparency overcomes loss aversion when the
   loss is concretely imaginable. Peer outcomes make the upside concretely
   imaginable instead.
3. **It compounds.** Every documented outcome that joins the peer set makes
   the next operator's panel stronger. The peer database is the moat — not
   the calculator and not the UI.

The current build implements the matcher and a synthetic fixture; the
production peer-outcome database is documented as a defined roadmap item
rather than fabricated. See [PEER_VALIDATION_AND_OUTCOME_LOOP.md](PEER_VALIDATION_AND_OUTCOME_LOOP.md).

## 5. Why equipment-agnostic export matters — but is not the core insight

Operators run different equipment stacks: John Deere, Case IH, AGCO, Trimble
displays, mixed fleets. A recommendation that can only be acted on by one
brand fails out of the gate. SoilProve exports CSV, GeoJSON, and PDF, has a
Deere packaging path, and ships OEM import guides.

But equipment-agnostic export is **table stakes**, not the differentiator.
Many tools export shapefiles. None of them, on their own, solve the
behavioral problem. The export step is necessary so peer-validated decisions
don't die between the laptop and the cab.

## 6. What the artifact pack said about feasibility and viability

The artifact pack treated **desirability** as the largest open question.
Pilot operators consistently say they would *consider* a tool like this, but
acting on it requires:

- A credible agronomist endorsement or extension affiliation.
- Verified peer outcomes from comparable fields (county or sub-region scale).
- An exit path back to flat-rate if the first season under-performs.

**Feasibility** is in good shape: the public USDA and NWS endpoints provide
the inputs SoilProve needs; the equipment side has documented import paths;
the decision math is implementable from public references.

**Viability** rests on the same flywheel that makes the product valuable: a
peer-outcome database that grows over time becomes both the trust mechanism
*and* the defensible asset. Distribution likely flows through agronomist /
retailer partnerships rather than direct-to-grower SaaS pricing in year one.

The artifact pack did **not** claim direct farmer validation of a sold
product; this document does not either. The product thesis is well-formed
and the implementation is honest about what is and isn't yet validated.

## 7. How the current codebase implements the artifact insights

- **"Existing soil data is not enough"** → the wizard accepts soil test
  uploads, auto-enriches USDA SSURGO context, and routes drainage class
  into the engine, but always positions the recommendation as a decision
  support output that should be reviewed.
- **"Farmers fear cutting rates"** → the peer-proof step exists as a
  first-class wizard step, not buried in a sidebar.
- **"Peer proof is the confidence bridge"** → similarity is multi-feature
  (distance, texture, rotation, yield, OM, drainage) and surfaces an
  honest aggregate of N reduction, yield change, and savings.
- **"Data-aware, margin-focused operator"** → the inputs page collects
  rotation, prices, and current rates as first-class economic variables,
  not as afterthoughts.
- **"Agronomist endorsement matters"** → the methodology page and the
  scientific-basis doc are written so a CCA can read them without
  cringing.
- **"Verified outcomes are the moat"** → the architecture isolates the
  peer fixture behind a clean interface; the upgrade path to a real
  outcome database is a data swap, not a redesign.
- **"Distribution and trust matter"** → equipment-agnostic exports and a
  Deere packaging path are wired in so the recommendation can flow into
  the operator's existing workflow.

## 8. What remains for a post-hackathon pilot

- **Licensed or sourced agronomic priors.** Replace `mrtn-priors.ts` with a
  validated dataset broken out by sub-state region.
- **Polygon-weighted SSURGO enrichment.** Aggregate dominant components
  across the drawn boundary instead of a centroid point query.
- **Calibrated weather risk.** Replace the three-state enum with a
  percentile-based recent-rainfall anomaly (PRISM / gridMET).
- **Verified peer outcome database.** Opt-in, anonymized, server-side,
  county-grain or finer.
- **Production Deere Work Plan POST** and additional OEM endpoints
  (ISOXML, Case IH, AGCO).
- **Outcome residual learning** on top of the economic prior.
- **CCA-facing report views** and lightweight shareable link auth.

None of these require changing the wizard, the API contracts, or the UI —
which was a deliberate design constraint and is the reason a real pilot is a
reachable target rather than a rewrite.
