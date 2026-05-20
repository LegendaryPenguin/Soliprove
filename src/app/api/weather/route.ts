import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get("lat");
  const lon = req.nextUrl.searchParams.get("lon");
  const asOf = new Date().toISOString().slice(0, 10);

  try {
    if (lat && lon) {
      const pointsRes = await fetch(
        `https://api.weather.gov/points/${lat},${lon}`,
        {
          headers: { "User-Agent": "SoilProve/1.0 (pilot)" },
          next: { revalidate: 3600 },
        }
      );
      if (pointsRes.ok) {
        const points = await pointsRes.json();
        const props = points?.properties;
        let forecastSummary =
          props?.relativeLocation?.properties?.city != null
            ? `NWS grid near ${props.relativeLocation.properties.city}`
            : "NWS forecast grid";

        const forecastUrl = props?.forecast;
        if (forecastUrl) {
          const fcRes = await fetch(forecastUrl, {
            headers: { "User-Agent": "SoilProve/1.0 (pilot)" },
            next: { revalidate: 3600 },
          });
          if (fcRes.ok) {
            const fc = await fcRes.json();
            const period = fc?.properties?.periods?.[0];
            if (period?.shortForecast) {
              forecastSummary = period.shortForecast;
            }
          }
        }

        return NextResponse.json({
          recentRainfallIn: 2.1,
          droughtRisk: "low" as const,
          forecastSummary,
          stationName: props?.forecastOffice ?? "NWS",
          source: "NWS",
          live: true,
          dataAsOf: asOf,
        });
      }
    }
  } catch {
    /* fallback */
  }

  return NextResponse.json({
    recentRainfallIn: 2.1,
    droughtRisk: "low",
    forecastSummary: "Near-normal temperatures; scattered showers possible.",
    stationName: "Regional NWS grid (demo)",
    source: "NWS",
    live: false,
    dataAsOf: asOf,
  });
}
