import { NextRequest, NextResponse } from "next/server";
import { isDeereEnabled } from "@/lib/deere/config";
import { getDeereSession } from "@/lib/deere/session";
import type { FieldProfile, Recommendation } from "@/types";

export async function POST(req: NextRequest) {
  const { field, recommendation, fieldId } = (await req.json()) as {
    field: FieldProfile;
    recommendation: Recommendation;
    fieldId?: string;
  };

  if (!field || !recommendation) {
    return NextResponse.json({ error: "field and recommendation required" }, { status: 400 });
  }

  if (!isDeereEnabled()) {
    return NextResponse.json({
      ok: true,
      demo: true,
      message:
        "Deere API disabled. Download GeoJSON and import manually in Operations Center.",
    });
  }

  const session = await getDeereSession();
  if (!session) {
    return NextResponse.json({ error: "Connect John Deere first" }, { status: 401 });
  }

  // Work Plans API varies by Deere program — store structured payload for push/review
  const payload = {
    fieldId: fieldId ?? field.id,
    fieldName: field.name,
    zones: recommendation.zones.map((z) => ({
      zone: z.zone,
      acres: z.acres,
      nitrogenLbAc: z.nRate,
      p2o5LbAc: z.p2o5Rate,
      k2oLbAc: z.k2oRate,
    })),
    summary: {
      n: recommendation.nRate,
      p2o5: recommendation.p2o5Rate,
      k2o: recommendation.k2oRate,
    },
  };

  return NextResponse.json({
    ok: true,
    message: "Prescription packaged for John Deere Operations Center.",
    payload,
    note: "Full Work Plan POST requires approved Deere production API access. Use GeoJSON export until promoted.",
  });
}
