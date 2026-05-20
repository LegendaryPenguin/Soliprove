import { NextRequest, NextResponse } from "next/server";

const REGION_DEFAULTS: Record<string, number> = {
  MO: 0.51,
  IL: 0.52,
  IA: 0.51,
  IN: 0.52,
  DEFAULT: 0.52,
};

export async function GET(req: NextRequest) {
  const state = req.nextUrl.searchParams.get("state") ?? "MO";
  const asOf = new Date().toISOString().slice(0, 10);
  const nLb = REGION_DEFAULTS[state] ?? REGION_DEFAULTS.DEFAULT;

  return NextResponse.json({
    nitrogenDefaultPerLb: nLb,
    phosphateDefaultPerLb: 0.52,
    potashDefaultPerLb: 0.38,
    regionLabel: `${state} — regional benchmark`,
    source: "USDA AMS regional benchmark",
    live: false,
    dataAsOf: asOf,
  });
}
