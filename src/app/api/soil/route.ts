import { NextRequest, NextResponse } from "next/server";

const MO_SOILS = [
  {
    name: "Sharkey clay",
    series: "Sharkey",
    texture: "clay",
    drainage: "Somewhat poorly drained",
    om: 2.8,
  },
  {
    name: "Dexter silt loam",
    series: "Dexter",
    texture: "silt loam",
    drainage: "Well drained",
    om: 3.2,
  },
];

export async function GET(req: NextRequest) {
  const lat = parseFloat(req.nextUrl.searchParams.get("lat") ?? "37.31");
  const lon = parseFloat(req.nextUrl.searchParams.get("lon") ?? "-89.52");
  const asOf = new Date().toISOString().slice(0, 10);

  const inMissouri = lat > 35.5 && lat < 40.5 && lon > -95.5 && lon < -89;
  const pick = inMissouri
    ? lat < 37.4
      ? MO_SOILS[0]
      : MO_SOILS[1]
    : {
        name: "Drummer silty clay loam",
        series: "Drummer",
        texture: "silty clay loam",
        drainage: "Poorly drained",
        om: 3.8,
      };

  return NextResponse.json({
    mapUnitKey: `regional-${Math.round(lat * 100)}-${Math.round(lon * 100)}`,
    mapUnitName: pick.name,
    soilSeries: pick.series,
    texture: pick.texture,
    slope: "0–2%",
    drainageClass: pick.drainage,
    hydrologicGroup: "B",
    availableWaterCapacity: "0.17 in/in",
    organicMatterEstimate: pick.om,
    confidence: "medium",
    lat,
    lon,
    source: inMissouri ? "USDA_NRCS_regional" : "USDA_NRCS_regional",
    live: false,
    dataAsOf: asOf,
    note: "Regional SSURGO-style defaults — connect SDA for map-unit precision",
  });
}
