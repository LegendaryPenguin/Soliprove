/**
 * SoilProve engine invariants
 *
 * Drives POST /api/recommendation with controlled samples and asserts:
 *   1. Higher N price never raises the recommended N rate (price monotonicity).
 *   2. corn_after_corn >= corn_after_soybean for identical conditions.
 *   3. wet + poorly drained >= dry + well drained for identical conditions.
 *   4. Output rate is a valid positive number.
 *   5. Response carries the expected Recommendation fields.
 *
 * The assertions are direction-only — they verify the engine behaves coherently,
 * not that any specific magnitude is "correct."
 */
const BASE = process.env.BASE_URL || "http://localhost:3000";

const REQUIRED_FIELDS = [
  "nRate",
  "p2o5Rate",
  "k2oRate",
  "savingsPerAcre",
  "totalSavings",
  "confidenceScore",
  "confidenceLabel",
  "confidenceBreakdown",
  "explanation",
  "zones",
];

const passes = [];
const failures = [];

function pass(name, detail) {
  passes.push({ name, detail });
  console.log(`✓ ${name}${detail ? ` — ${detail}` : ""}`);
}

function fail(name, detail) {
  failures.push({ name, detail });
  console.error(`✗ ${name} — ${detail}`);
}

function baseField(overrides = {}) {
  const soil = {
    mapUnitName: "Drummer silty clay loam",
    soilSeries: "Drummer",
    texture: "silty clay loam",
    slope: "0-2%",
    drainageClass: "Well drained",
    hydrologicGroup: "B",
    organicMatterEstimate: 3.5,
    source: "USDA_NRCS_SSURGO",
    confidence: "high",
    ...(overrides.soil ?? {}),
  };
  const weather = {
    droughtRisk: "low",
    forecastSummary: "Near-normal",
    source: "NWS",
    ...(overrides.weather ?? {}),
  };
  return {
    id: "engine-test",
    name: "Engine Verification Field",
    lat: 37.3059,
    lon: -89.5181,
    acres: 40,
    county: "Cape Girardeau",
    state: "MO",
    soil,
    cropBenchmark: {
      countyCornYieldBuAc: 200,
      stateCornYieldBuAc: 195,
      source: "USDA_NASS",
    },
    weather,
    fertilizerPrices: {
      nitrogenDefaultPerLb: 0.5,
      regionLabel: "MO demo",
      source: "USDA AMS",
    },
  };
}

function baseInput(overrides = {}) {
  return {
    rotation: "corn_after_soybean",
    cornPricePerBu: 4.25,
    nitrogenProduct: "anhydrous",
    nitrogenPricePerTon: 650,
    nitrogenPricePerLb: 0.5,
    currentNRate: 180,
    currentP2O5Rate: 70,
    currentK2ORate: 80,
    soilTest: { phosphorusPpm: 28, potassiumPpm: 185, organicMatterPct: 3.5 },
    ...overrides,
  };
}

async function recommend(field, input) {
  const res = await fetch(`${BASE}/api/recommendation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ field, input }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

async function check(name, fn) {
  try {
    await fn();
  } catch (e) {
    fail(name, e.message);
  }
}

async function main() {
  console.log(`\nSoilProve engine invariants — ${BASE}\n`);

  // 1. Higher N price never increases the recommended N rate.
  await check("Higher N price does not raise recommended N", async () => {
    const field = baseField();
    const cheap = await recommend(field, baseInput({ nitrogenPricePerLb: 0.35 }));
    const pricey = await recommend(field, baseInput({ nitrogenPricePerLb: 1.0 }));
    if (typeof cheap.nRate !== "number" || typeof pricey.nRate !== "number") {
      throw new Error("nRate missing or non-numeric");
    }
    if (pricey.nRate > cheap.nRate) {
      throw new Error(
        `expected pricey N (${pricey.nRate}) <= cheap N (${cheap.nRate})`
      );
    }
    pass(
      "Higher N price does not raise recommended N",
      `cheap=${cheap.nRate} pricey=${pricey.nRate}`
    );
  });

  // 2. Corn-after-corn >= corn-after-soybean for identical conditions.
  await check("corn_after_corn >= corn_after_soybean", async () => {
    const field = baseField();
    const soy = await recommend(field, baseInput({ rotation: "corn_after_soybean" }));
    const cc = await recommend(field, baseInput({ rotation: "corn_after_corn" }));
    if (cc.nRate < soy.nRate) {
      throw new Error(
        `corn_after_corn (${cc.nRate}) < corn_after_soybean (${soy.nRate})`
      );
    }
    pass(
      "corn_after_corn >= corn_after_soybean",
      `cc=${cc.nRate} soy=${soy.nRate}`
    );
  });

  // 3. Wet + poorly drained >= dry + well drained for identical conditions.
  await check("wet+poorly drained >= dry+well drained", async () => {
    const wetField = baseField({
      soil: { drainageClass: "Poorly drained" },
      weather: { droughtRisk: "low", recentRainfallIn: 6 },
    });
    const dryField = baseField({
      soil: { drainageClass: "Well drained" },
      weather: { droughtRisk: "elevated", recentRainfallIn: 0.5 },
    });
    const wet = await recommend(wetField, baseInput());
    const dry = await recommend(dryField, baseInput());
    if (wet.nRate < dry.nRate) {
      throw new Error(
        `wet+poorly (${wet.nRate}) < dry+well (${dry.nRate})`
      );
    }
    pass(
      "wet+poorly drained >= dry+well drained",
      `wet=${wet.nRate} dry=${dry.nRate}`
    );
  });

  // 4 & 5. Output is a valid positive number and response shape is complete.
  await check("recommendation shape and validity", async () => {
    const data = await recommend(baseField(), baseInput());
    if (typeof data.nRate !== "number" || !Number.isFinite(data.nRate) || data.nRate <= 0) {
      throw new Error(`nRate invalid: ${data.nRate}`);
    }
    const missing = REQUIRED_FIELDS.filter((k) => !(k in data));
    if (missing.length) {
      throw new Error(`missing fields: ${missing.join(", ")}`);
    }
    if (!Array.isArray(data.zones) || data.zones.length === 0) {
      throw new Error("zones must be a non-empty array");
    }
    pass(
      "recommendation shape and validity",
      `nRate=${data.nRate} zones=${data.zones.length} score=${data.confidenceScore}`
    );
  });

  const total = passes.length + failures.length;
  console.log(`\n---\n${passes.length}/${total} engine invariants passed`);
  if (failures.length) {
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("Engine verification FAILED:", e.message);
  process.exit(1);
});
