import { NextRequest, NextResponse } from "next/server";

/** Reverse geocode — mock for hackathon; swap with Census Geocoder in production */
export async function POST(req: NextRequest) {
  const { lat, lon } = await req.json();

  const state =
    lat > 36 && lat < 43 && lon > -95 && lon < -87
      ? "IL"
      : lat > 40 && lat < 44 && lon > -97 && lon < -90
        ? "IA"
        : "IL";

  const county =
    state === "IL" && lat > 40 && lat < 40.3 ? "Champaign" : "Story";

  return NextResponse.json({
    lat,
    lon,
    state,
    county,
    source: "demo_geocoder",
  });
}
