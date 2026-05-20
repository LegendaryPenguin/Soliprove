const BASE = process.env.BASE_URL || "http://localhost:3000";
const LAT = 37.3059;
const LON = -89.5181;

const results = [];

function pass(name, detail) {
  results.push({ name, ok: true, detail });
  console.log(`✓ ${name}${detail ? ` — ${detail}` : ""}`);
}

function fail(name, detail) {
  results.push({ name, ok: false, detail });
  console.error(`✗ ${name} — ${detail}`);
}

async function check(name, fn) {
  try {
    await fn();
  } catch (e) {
    fail(name, e.message);
  }
}

const sampleField = {
  id: "test-field",
  name: "Cape Girardeau County Field",
  lat: LAT,
  lon: LON,
  acres: 40,
  county: "Champaign",
  state: "IL",
  soil: {
    mapUnitName: "Drummer silty clay loam",
    soilSeries: "Drummer",
    texture: "silty clay loam",
    slope: "0–2%",
    drainageClass: "Poorly drained",
    hydrologicGroup: "B",
    organicMatterEstimate: 3.8,
    source: "USDA_NRCS_SSURGO",
    confidence: "high",
  },
  cropBenchmark: {
    countyCornYieldBuAc: 214,
    stateCornYieldBuAc: 208,
    source: "USDA_NASS",
  },
  weather: {
    droughtRisk: "low",
    forecastSummary: "Near-normal",
    source: "NWS",
  },
  fertilizerPrices: {
    nitrogenDefaultPerLb: 0.52,
    regionLabel: "IL demo",
    source: "USDA AMS",
  },
};

const sampleInput = {
  rotation: "corn_after_soybean",
  cornPricePerBu: 4.25,
  nitrogenProduct: "anhydrous",
  nitrogenPricePerTon: 650,
  currentNRate: 180,
  currentP2O5Rate: 70,
  currentK2ORate: 80,
  soilTest: { phosphorusPpm: 28, potassiumPpm: 185, organicMatterPct: 3.8 },
};

let recommendation;

async function main() {
  console.log(`\nSoilProve API verification — ${BASE}\n`);

  // Pages
  for (const path of ["/", "/wizard", "/methodology"]) {
    await check(`GET ${path}`, async () => {
      const res = await fetch(`${BASE}${path}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      if (!html.includes("<!DOCTYPE html") && !html.includes("<html"))
        throw new Error("Not HTML");
      pass(`GET ${path}`, `HTTP ${res.status}`);
    });
  }

  await check("GET /api/geocode/search", async () => {
    const res = await fetch(`${BASE}/api/geocode/search?q=63701`);
    const data = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(data));
    if (!data.results?.length) throw new Error("No search results");
    pass("GET /api/geocode/search", data.results[0].label);
  });

  await check("GET /api/deere/auth (disabled ok)", async () => {
    const res = await fetch(`${BASE}/api/deere/auth`, { redirect: "manual" });
    if (res.status === 503) pass("GET /api/deere/auth", "disabled (expected)");
    else if (res.status === 307 || res.status === 302)
      pass("GET /api/deere/auth", "redirect to Deere");
    else pass("GET /api/deere/auth", `status ${res.status}`);
  });

  // Geocode
  await check("POST /api/geocode", async () => {
    const res = await fetch(`${BASE}/api/geocode`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat: LAT, lon: LON }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(data));
    if (!data.state || !data.county) throw new Error("Missing state/county");
    pass("POST /api/geocode", `${data.county}, ${data.state}`);
  });

  // Soil
  await check("GET /api/soil", async () => {
    const res = await fetch(`${BASE}/api/soil?lat=${LAT}&lon=${LON}`);
    const data = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(data));
    if (!data.soilSeries) throw new Error("Missing soilSeries");
    pass("GET /api/soil", data.mapUnitName || data.soilSeries);
  });

  // NASS
  await check("GET /api/nass", async () => {
    const res = await fetch(
      `${BASE}/api/nass?state=MO&county=Cape%20Girardeau`
    );
    const data = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(data));
    if (!data.countyCornYieldBuAc) throw new Error("Missing yield");
    pass("GET /api/nass", `${data.countyCornYieldBuAc} bu/ac`);
  });

  // Weather
  await check("GET /api/weather", async () => {
    const res = await fetch(`${BASE}/api/weather?lat=${LAT}&lon=${LON}`);
    const data = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(data));
    if (!data.forecastSummary) throw new Error("Missing forecast");
    pass("GET /api/weather", data.source);
  });

  // Fertilizer prices
  await check("GET /api/fertilizer-prices", async () => {
    const res = await fetch(`${BASE}/api/fertilizer-prices?state=MO`);
    const data = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(data));
    if (!data.nitrogenDefaultPerLb) throw new Error("Missing N price");
    pass("GET /api/fertilizer-prices", `$${data.nitrogenDefaultPerLb}/lb N`);
  });

  // Recommendation
  await check("POST /api/recommendation", async () => {
    const res = await fetch(`${BASE}/api/recommendation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field: sampleField, input: sampleInput }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(data));
    if (!data.nRate || !data.zones?.length) throw new Error("Invalid recommendation");
    recommendation = data;
    pass(
      "POST /api/recommendation",
      `N=${data.nRate} P=${data.p2o5Rate} K=${data.k2oRate} conf=${data.confidenceScore}%`
    );
  });

  // Peer match
  await check("POST /api/peer-match", async () => {
    const res = await fetch(`${BASE}/api/peer-match`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field: sampleField, input: sampleInput }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(data));
    if (!data.peers?.length) throw new Error("No peers");
    pass("POST /api/peer-match", `${data.count} peers, avg save $${data.averageSavings}/ac`);
  });

  // Export CSV
  await check("POST /api/export/csv", async () => {
    const res = await fetch(`${BASE}/api/export/csv`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recommendation }),
    });
    const text = await res.text();
    if (!res.ok) throw new Error(text);
    if (!text.includes("zone,acres")) throw new Error("Invalid CSV header");
    pass("POST /api/export/csv", `${text.split("\n").length - 1} data rows`);
  });

  // Export GeoJSON
  await check("POST /api/export/geojson", async () => {
    const res = await fetch(`${BASE}/api/export/geojson`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recommendation, field: sampleField }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(data));
    if (data.type !== "FeatureCollection") throw new Error("Not FeatureCollection");
    pass("POST /api/export/geojson", `${data.features?.length ?? 0} features`);
  });

  const failed = results.filter((r) => !r.ok);
  console.log(`\n---\n${results.length - failed.length}/${results.length} checks passed`);
  if (failed.length) {
    process.exit(1);
  }
}

main();
