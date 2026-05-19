import { NextRequest, NextResponse } from "next/server";

const COUNTY_YIELDS: Record<string, number> = {
  Champaign: 214,
  Story: 198,
  Tippecanoe: 205,
  DEFAULT: 210,
};

export async function GET(req: NextRequest) {
  const county = req.nextUrl.searchParams.get("county") ?? "Champaign";
  const state = req.nextUrl.searchParams.get("state") ?? "IL";

  const countyCornYieldBuAc =
    COUNTY_YIELDS[county] ?? COUNTY_YIELDS.DEFAULT;

  return NextResponse.json({
    countyCornYieldBuAc,
    stateCornYieldBuAc: state === "IL" ? 208 : 198,
    countyCornAcres: 185000,
    source: "USDA_NASS",
    note: "Mock NASS Quick Stats — add NASS_API_KEY for live data",
  });
}
