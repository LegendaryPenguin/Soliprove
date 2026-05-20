import { NextRequest, NextResponse } from "next/server";

const COUNTY_YIELDS: Record<string, number> = {
  "Cape Girardeau": 192,
  Champaign: 214,
  Story: 198,
  Tippecanoe: 205,
  DEFAULT: 195,
};

const STATE_YIELDS: Record<string, number> = {
  MO: 168,
  IL: 208,
  IA: 198,
  IN: 200,
  DEFAULT: 198,
};

async function fetchNassLive(state: string, county: string) {
  const key = process.env.NASS_API_KEY?.trim();
  if (!key) return null;

  const params = new URLSearchParams({
    key,
    source_desc: "SURVEY",
    sector_desc: "CROPS",
    group_desc: "FIELD CROPS",
    commodity_desc: "CORN",
    statisticcat_desc: "YIELD",
    agg_level_desc: "COUNTY",
    state_name: state === "MO" ? "MISSOURI" : state === "IL" ? "ILLINOIS" : state,
    county_name: county.toUpperCase(),
    format: "JSON",
    year: String(new Date().getFullYear() - 1),
  });

  const res = await fetch(
    `https://quickstats.nass.usda.gov/api/api_GET/?${params}`,
    { next: { revalidate: 604800 } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  const row = data?.data?.[0];
  const val = parseFloat(row?.Value?.replace(/,/g, "") ?? "");
  if (!Number.isFinite(val)) return null;
  return val;
}

export async function GET(req: NextRequest) {
  const county = req.nextUrl.searchParams.get("county") ?? "Cape Girardeau";
  const state = req.nextUrl.searchParams.get("state") ?? "MO";
  const asOf = new Date().toISOString().slice(0, 10);

  let countyCornYieldBuAc = COUNTY_YIELDS[county] ?? COUNTY_YIELDS.DEFAULT;
  let live = false;

  try {
    const liveYield = await fetchNassLive(state, county);
    if (liveYield) {
      countyCornYieldBuAc = Math.round(liveYield);
      live = true;
    }
  } catch {
    /* fallback table */
  }

  return NextResponse.json({
    countyCornYieldBuAc,
    stateCornYieldBuAc: STATE_YIELDS[state] ?? STATE_YIELDS.DEFAULT,
    countyCornAcres: 42000,
    source: live ? "USDA_NASS" : "USDA_NASS_regional_table",
    live,
    dataAsOf: asOf,
  });
}
