import { NextRequest, NextResponse } from "next/server";

const REGION_DEFAULTS: Record<string, number> = {
  IL: 0.52,
  IA: 0.5,
  IN: 0.51,
  DEFAULT: 0.52,
};

export async function GET(req: NextRequest) {
  const state = req.nextUrl.searchParams.get("state") ?? "IL";
  const nLb = REGION_DEFAULTS[state] ?? REGION_DEFAULTS.DEFAULT;

  return NextResponse.json({
    nitrogenDefaultPerLb: nLb,
    phosphateDefaultPerLb: 0.52,
    potashDefaultPerLb: 0.38,
    regionLabel: `${state} — USDA AMS regional default (demo)`,
    source: "USDA AMS Market News (demo default)",
  });
}
