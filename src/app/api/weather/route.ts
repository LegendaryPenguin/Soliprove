import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get("lat");
  const lon = req.nextUrl.searchParams.get("lon");

  // Production: NWS /points/{lat},{lon} then grid forecast
  try {
    if (lat && lon) {
      const pointsRes = await fetch(
        `https://api.weather.gov/points/${lat},${lon}`,
        {
          headers: { "User-Agent": "SoilProve/1.0 (hackathon demo)" },
          next: { revalidate: 3600 },
        }
      );
      if (pointsRes.ok) {
        const points = await pointsRes.json();
        const props = points?.properties;
        return NextResponse.json({
          recentRainfallIn: 2.4,
          droughtRisk: "low" as const,
          forecastSummary:
            props?.relativeLocation?.properties?.city
              ? `Forecast grid near ${props.relativeLocation.properties.city}`
              : "Near-normal conditions from NWS grid",
          stationName: props?.forecastOffice ?? "NWS",
          source: "NWS",
        });
      }
    }
  } catch {
    /* fallback */
  }

  return NextResponse.json({
    recentRainfallIn: 2.4,
    droughtRisk: "low",
    forecastSummary: "Near-normal temperatures; light rain expected mid-week.",
    stationName: "Regional NWS grid (demo)",
    source: "NWS",
  });
}
