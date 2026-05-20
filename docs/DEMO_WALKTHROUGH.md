# Demo Walkthrough

Two scripts: a tight 90-second judge path that hits every load-bearing
moment, and a 5-minute presentation path with the narrative beats that
explain *why* each step exists. Both assume `npm run dev` is running and
`http://localhost:3000` is open.

---

## 90-second judge path

1. **Open home** (`/`).
   Landing makes the thesis visible above the fold: map-first prescriptions
   with peer validation.
2. **Click "Start wizard"**.
   The wizard opens on Step 1 with the default Cape Girardeau County, MO
   pin already placed (`37.3059, -89.5181`, ZIP `63701`).
3. **Click "Continue"** without drawing a polygon (default field works).
4. **Step 2 — Field context.**
   USDA SDA/SSURGO soil, NASS county yield, NWS forecast, and regional
   fertilizer prices auto-load. Note the source labels (`USDA_NRCS_SSURGO`,
   `USDA_NASS`, `NWS`) and `asOf` timestamps.
5. **Step 3 — Farm inputs.**
   Defaults are already set (`corn_after_soybean`, $4.25/bu corn, anhydrous
   at $650/ton, current N 180 lb/ac). Click **Continue**.
6. **Step 4 — Prescription.**
   See the recommended N / P / K, the per-acre savings vs. the current
   rate, the confidence breakdown, and three zones clipped to the boundary.
   Note that the recommendation came from `/api/recommendation` (server
   authority).
7. **Step 5 — Peer proof.**
   Structurally similar fields surface with documented N reductions and
   yield outcomes. Average reduction, average yield change, and average
   savings are aggregated at the top.
8. **Step 6 — Export.**
   Hit **Download PDF** or **Download GeoJSON**. The Deere card shows the
   packaging path even if you don't OAuth in.

Total: ~90 seconds, no typing required.

## 5-minute presentation path

Use the same six steps, but narrate the *why* at each one.

1. **Landing** — *"This is not a calculator. This is a trust artifact
   wrapped around a defensible recommendation."* Point to the six-step
   strip; emphasize the peer-proof step.
2. **Step 1 — Field location** — *"Cape Girardeau is the default so this
   demo is one click from a real Midwest field. Operators can draw a
   polygon, drop a pin, upload GeoJSON, or geolocate. Acres are computed
   from the polygon."*
3. **Step 2 — Field context** — *"Everything you see is auto-loaded.
   Live USDA SDA/SSURGO for soil, USDA NASS for the county yield
   benchmark, NWS for the forecast. Each source is labeled. If a live
   source is unavailable we degrade to regional defaults with the same
   shape — no failure modes during a demo or in rural connectivity."*
4. **Step 3 — Farm inputs** — *"Rotation, prices, current rates, and an
   optional soil-test upload are first-class economic variables, not
   afterthoughts. This is how a margin-focused operator actually thinks."*
5. **Step 4 — Prescription** — *"Here is where the science enters.
   Nitrogen comes from an MRTN-inspired engine: price ratio in,
   profitable range out, bounded weather + drainage bias inside that
   range. Every coefficient is documented in `docs/DECISION_ENGINE.md`.
   The confidence score is a transparent composite, not a faked
   statistical interval. The zone map clips to the boundary."*
6. **Step 5 — Peer proof** — *"This is the load-bearing step. Yield-risk
   aversion is the real adoption barrier, and peer outcomes are the
   format growers actually use to overcome it. The matcher weighs
   distance, soil texture, rotation, yield benchmark, OM, and drainage
   — interpretable and inspectable. Today these peers are a synthetic
   fixture; in production they're an opt-in verified-outcome database.
   That outcome database is the moat."*
7. **Step 6 — Export** — *"Equipment-agnostic. CSV and GeoJSON for any
   modern controller, PDF for the CCA conversation, Deere packaging for
   operators on green iron. None of this matters if the recommendation
   isn't trusted; all of it matters once it is."*

End on the **methodology page** (`/methodology`) and the
[JUDGE_START_HERE.md](../JUDGE_START_HERE.md) tour — these are the artifacts
that survive scrutiny after the demo ends.

## What to narrate

A short list of lines worth saying out loud during the demo so the framing
is unmissable:

- *"This is not just a calculator."*
- *"Here is how yield-risk aversion is addressed — peer proof as a
  first-class wizard step."*
- *"Here is where the science enters — MRTN-inspired engine with documented
  coefficients."*
- *"Here is how operators take action — equipment-agnostic exports plus a
  Deere packaging path."*
- *"Here is what's real and what's prototype — every prototype piece lives
  behind a clean interface."*

## Verification (optional, ~10 seconds)

In a second terminal:

```bash
npm run verify
```

Runs `verify-apis.mjs`, `verify-flow.mjs`, and `verify-engine.mjs`. The
engine script asserts:

- Higher N price never increases the recommended rate.
- Corn-after-corn ≥ corn-after-soybean.
- Wet + poorly drained ≥ dry + well drained.
- The endpoint returns a valid positive rate with the expected response shape.

That's the demo. Five minutes to the whole pitch; ninety seconds to the
working product.
