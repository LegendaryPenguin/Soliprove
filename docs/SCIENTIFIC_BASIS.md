# Scientific Basis

This document collects the public references that inform SoilProve's
prototype decision engine and soil-context enrichment. It is intentionally
concise: each entry explains *what* the link supports, not a literature
review.

---

## 1. MRTN, price ratio, and the profitable nitrogen range

- **Corn Nitrogen Rate Calculator — About**
  <https://www.cornnratecalc.org/about>

- **Corn Nitrogen Rate Calculator — Tool**
  <https://www.cornnratecalc.org/>

These two pages describe the Maximum Return To Nitrogen (MRTN) approach used
across the Corn Belt: rather than recommending a single yield-maximizing
rate, the calculator selects an N rate that maximizes expected partial
return at a given N:corn price ratio and exposes a "profitable range" around
that rate. SoilProve's prior-table architecture
(`src/lib/recommendation/mrtn-priors.ts`) is structurally similar — each
prior carries a `profitableLow`, an `mrtnRate`, and a `profitableHigh` — but
the embedded numbers are demonstration heuristics, not official MRTN
outputs.

## 2. Dynamic N decisions: management, weather, location, previous crop, precipitation, prices

- **N-FACT: Nitrogen Fertilizer Application Consultation Tool (Iowa State Extension)**
  <https://crops.extension.iastate.edu/users-guide-n-fact-nitrogen-fertilizer-application-consultation-tool>

N-FACT documents the in-season factors that legitimately move an N
recommendation away from a static state baseline: previous crop, planting
date, spring precipitation, management, and prices. This supports SoilProve's
choice to layer a bounded weather/drainage bias on top of an economic prior
rather than relying on state baselines alone.

## 3. Drainage and rainfall as field-scale context

- **Michigan State Extension — Site-Specific Corn Nitrogen Management**
  <https://www.canr.msu.edu/news/site-specific-corn-nitrogen-management>

This article frames drainage class and recent precipitation as legitimate
field-scale modifiers when adapting whole-field guidance. It supports the
direction (not the magnitude) of SoilProve's drainage bias: poorly drained
soils generally warrant a positive N adjustment relative to well-drained
soils under otherwise comparable conditions.

## 4. Risk-aware decision framing

- **Risk-Aware Decision-Theoretic Approach to Nitrogen Recommendations (arXiv:2208.04840)**
  <https://arxiv.org/abs/2208.04840>

This paper formalizes the move from point estimates to risk-aware
recommendations under economic and agronomic uncertainty. SoilProve does not
implement a full decision-theoretic model; the existence of an explicit
`[L, M, H]` profitable range and a bounded bias is a much simpler scaffold
inspired by this framing.

## 5. SSURGO / Soil Data Access (SDA) legitimacy

- **Soil Survey Geographic Database (SSURGO) overview**
  <https://www.nrcs.usda.gov/resources/data-and-reports/soil-survey-geographic-database-ssurgo>

- **Soil Data Access (SDA) — public REST endpoint**
  <https://sdmdataaccess.sc.egov.usda.gov/>

- **SDA-GIS Intersect report (point/polygon intersect against SSURGO map units)**
  <https://nasis.sc.egov.usda.gov/NasisReportsWebSite/limsreport.aspx?report_name=SDA-GIS_intersect>

`src/lib/soil/sda-soil.ts` calls the SDA REST endpoint with a point intersect
against the `mupolygon` table joined to `mapunit`, `component`, and
`chorizon`, mirroring the structure of the public SDA-GIS Intersect report.
When the call succeeds we return live SSURGO-backed map unit name, dominant
component, drainage class, hydrologic group, available water capacity, and
organic-matter estimate. When it fails for any reason — network, timeout,
empty result — we fall back to the existing regional defaults without
breaking the demo.

---

## Scientific honesty

- SoilProve is **not** a certified agronomic calculator. The recommendation
  it produces should be treated as a directional, illustrative starting
  point.
- The prototype prior values in `mrtn-priors.ts` are **not** official MRTN
  outputs. They are calibrated to preserve the legacy demo's visual numbers
  while exposing a more honest "profitable range" architecture.
- The bias coefficients (`+0.20` wet_spring, `+0.15` poorly drained, etc.)
  are **transparent heuristics**. Their *direction* is grounded in standard
  agronomic logic; their *magnitudes* are demonstration choices and should
  be replaced before any production deployment.
- Live USDA SDA/SSURGO enrichment improves the **field context** that feeds
  the recommendation. It does not make the model itself exact. Even with
  ground-truth soil, an MRTN-style recommendation remains an *expected*
  optimum at the price ratio, not a guaranteed in-season optimum.
- SoilProve does not currently surface a calibrated yield-loss probability
  or a calibrated savings probability. Reported "savings" in the UI are the
  delta between the user's stated current rate and the model's recommended
  rate at current prices, not a guarantee.

## Why this is still a strong business foundation

- The engine architecture now mirrors how real-world agronomic decision-
  support tools actually frame the problem: economics in, profitable range
  out, field context adjusts within the range.
- The prior table (`src/lib/recommendation/mrtn-priors.ts`) and the soil
  provider abstraction (`src/lib/soil/sda-soil.ts`) are isolated behind
  clean interfaces. Either can be swapped for a validated source — a
  licensed agronomic dataset, a direct calculator integration, a polygon-
  based soil enrichment provider — without redesigning the wizard,
  changing the API response shape, or touching the UI.
- The fallback path is robust: when a live data source is unavailable the
  app degrades to plausible regional defaults rather than failing. This is
  the right shape for a product that has to ship reliably across
  intermittent rural connectivity and partner outages.
- Because the recommendation, soil, savings, peer-proof, and export
  contracts are unchanged, every piece of downstream value (PDF report,
  GeoJSON / CSV export, John Deere workplan handoff) automatically benefits
  from the more defensible engine without rework.
