import { NextRequest, NextResponse } from "next/server";
import { CAPE_GIRARDEAU } from "@/lib/defaults/location";

export async function POST(req: NextRequest) {
  const { lat, lon } = await req.json();
  const y = Number(lat);
  const x = Number(lon);

  if (!Number.isFinite(y) || !Number.isFinite(x)) {
    return NextResponse.json({ error: "lat and lon required" }, { status: 400 });
  }

  try {
    const url = new URL(
      "https://geocoding.geo.census.gov/geocoder/geographies/coordinates"
    );
    url.searchParams.set("x", String(x));
    url.searchParams.set("y", String(y));
    url.searchParams.set("benchmark", "Public_AR_Current");
    url.searchParams.set("vintage", "Current_Current");
    url.searchParams.set("format", "json");

    const res = await fetch(url.toString(), { next: { revalidate: 86400 } });
    if (res.ok) {
      const data = await res.json();
      const counties =
        data?.result?.geographies?.["Counties"] ??
        data?.result?.geographies?.Counties;
      const states =
        data?.result?.geographies?.["States"] ??
        data?.result?.geographies?.States;
      const county = counties?.[0]?.NAME;
      const state = states?.[0]?.STUSAB ?? states?.[0]?.STATE_CODE;

      if (county && state) {
        return NextResponse.json({
          lat: y,
          lon: x,
          state,
          county,
          source: "US_Census_Geocoder",
          live: true,
        });
      }
    }
  } catch {
    /* fallback */
  }

  const nearCape =
    y > 36.8 && y < 37.8 && x > -89.9 && x < -89.1;

  return NextResponse.json({
    lat: y,
    lon: x,
    state: nearCape ? CAPE_GIRARDEAU.state : "MO",
    county: nearCape ? CAPE_GIRARDEAU.county : "Cape Girardeau",
    source: "regional_fallback",
    live: false,
  });
}
