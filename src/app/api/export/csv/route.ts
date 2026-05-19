import { NextRequest, NextResponse } from "next/server";
import { recommendationToCsv } from "@/lib/export/formats";
import type { Recommendation } from "@/types";

export async function POST(req: NextRequest) {
  const { recommendation } = (await req.json()) as {
    recommendation: Recommendation;
  };

  if (!recommendation) {
    return NextResponse.json({ error: "recommendation required" }, { status: 400 });
  }

  const csv = recommendationToCsv(recommendation);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="soilprove-zones.csv"',
    },
  });
}
