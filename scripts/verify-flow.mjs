/**
 * Simulates wizard data flow: geocode → parallel context APIs → recommendation → peers
 */
const BASE = process.env.BASE_URL || "http://localhost:3000";
const LAT = 37.3059;
const LON = -89.5181;
const ACRES = 40;

async function main() {
  console.log("\nWizard flow simulation\n");

  const geoRes = await fetch(`${BASE}/api/geocode`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lat: LAT, lon: LON }),
  });
  const geo = await geoRes.json();
  console.log("1. Field pin → geocode:", geo.county, geo.state);

  const [soil, nass, weather, prices] = await Promise.all([
    fetch(`${BASE}/api/soil?lat=${LAT}&lon=${LON}`).then((r) => r.json()),
    fetch(`${BASE}/api/nass?state=${geo.state}&county=${geo.county}`).then((r) =>
      r.json()
    ),
    fetch(`${BASE}/api/weather?lat=${LAT}&lon=${LON}`).then((r) => r.json()),
    fetch(`${BASE}/api/fertilizer-prices?state=${geo.state}`).then((r) =>
      r.json()
    ),
  ]);

  const field = {
    id: "flow-test",
    name: `${geo.county} County Field`,
    lat: LAT,
    lon: LON,
    acres: ACRES,
    county: geo.county,
    state: geo.state,
    soil: { ...soil, source: "USDA_NRCS_SSURGO", confidence: soil.confidence || "high" },
    cropBenchmark: { ...nass, source: "USDA_NASS" },
    weather,
    fertilizerPrices: prices,
  };

  console.log("2. Context loaded:");
  console.log("   Soil:", field.soil?.mapUnitName || field.soil?.soilSeries);
  console.log("   Yield:", field.cropBenchmark?.countyCornYieldBuAc, "bu/ac");
  console.log("   Weather:", field.weather?.forecastSummary?.slice(0, 50) + "...");
  console.log("   N price: $", field.fertilizerPrices?.nitrogenDefaultPerLb, "/lb");

  const input = {
    rotation: "corn_after_soybean",
    cornPricePerBu: 4.25,
    nitrogenProduct: "anhydrous",
    nitrogenPricePerTon: 650,
    currentNRate: 180,
    currentP2O5Rate: 70,
    currentK2ORate: 80,
  };

  const recRes = await fetch(`${BASE}/api/recommendation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ field, input }),
  });
  const rec = await recRes.json();
  console.log("3. Prescription:");
  console.log(
    `   N ${input.currentNRate} → ${rec.nRate} | Savings $${rec.savingsPerAcre}/ac | Confidence ${rec.confidenceScore}%`
  );
  console.log(`   Zones: ${rec.zones.map((z) => z.zone).join(", ")}`);

  const peerRes = await fetch(`${BASE}/api/peer-match`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ field, input }),
  });
  const peers = await peerRes.json();
  console.log("4. Peers:", peers.count, "fields, avg N cut", peers.averageNReduction, "lb/ac");

  const csvRes = await fetch(`${BASE}/api/export/csv`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recommendation: rec }),
  });
  const csv = await csvRes.text();
  console.log("5. Export CSV lines:", csv.trim().split("\n").length);

  // Error handling
  const bad = await fetch(`${BASE}/api/recommendation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  if (bad.status !== 400) throw new Error("Expected 400 for empty body");
  console.log("6. Validation: empty POST returns 400 ✓");

  console.log("\nFlow simulation OK\n");
}

main().catch((e) => {
  console.error("Flow FAILED:", e.message);
  process.exit(1);
});
