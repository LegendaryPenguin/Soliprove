import { NextRequest, NextResponse } from "next/server";

type CensusMatch = {
  coordinates?: { x: number; y: number };
  matchedAddress?: string;
};

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 3) {
    return NextResponse.json({ results: [] });
  }

  try {
    const url = new URL(
      "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress"
    );
    url.searchParams.set("address", q);
    url.searchParams.set("benchmark", "Public_AR_Current");
    url.searchParams.set("format", "json");

    const res = await fetch(url.toString(), { next: { revalidate: 86400 } });
    if (!res.ok) throw new Error("Census geocoder unavailable");

    const data = await res.json();
    const matches: CensusMatch[] =
      data?.result?.addressMatches ?? [];

    const results = matches.slice(0, 5).map((m) => ({
      lat: m.coordinates?.y ?? 0,
      lon: m.coordinates?.x ?? 0,
      label: m.matchedAddress ?? q,
    }));

    return NextResponse.json({ results });
  } catch {
    // Demo fallback for common Midwest ZIP
    if (/^\d{5}$/.test(q)) {
      return NextResponse.json({
        results: [
          {
            lat: 40.1164,
            lon: -88.2434,
            label: `${q} (demo — Champaign, IL area)`,
          },
        ],
        demo: true,
      });
    }
    return NextResponse.json({ results: [], demo: true });
  }
}
