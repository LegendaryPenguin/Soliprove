import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const lat = parseFloat(req.nextUrl.searchParams.get("lat") ?? "40.12");
  const lon = parseFloat(req.nextUrl.searchParams.get("lon") ?? "-88.24");

  // Production: NRCS Soil Data Access (SDA) spatial query
  return NextResponse.json({
    mapUnitKey: `demo-${Math.round(lat * 100)}`,
    mapUnitName: "Drummer silty clay loam",
    soilSeries: "Drummer",
    texture: "silty clay loam",
    slope: "0–2%",
    drainageClass: "Poorly drained",
    hydrologicGroup: "B",
    availableWaterCapacity: "0.18 in/in",
    organicMatterEstimate: 3.8,
    confidence: "high",
    lat,
    lon,
    note: "Mock SSURGO response — connect SDA web service for production",
  });
}
