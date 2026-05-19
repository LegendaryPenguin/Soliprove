import { NextRequest, NextResponse } from "next/server";
import { recommendationToGeoJSON } from "@/lib/export/formats";
import type { FieldProfile, Recommendation } from "@/types";

export async function POST(req: NextRequest) {
  const { recommendation, field } = (await req.json()) as {
    recommendation: Recommendation;
    field?: FieldProfile;
  };

  if (!recommendation) {
    return NextResponse.json({ error: "recommendation required" }, { status: 400 });
  }

  const geojson = recommendationToGeoJSON(recommendation, field);
  return NextResponse.json(geojson, {
    headers: {
      "Content-Disposition": 'attachment; filename="soilprove-zones.geojson"',
    },
  });
}
