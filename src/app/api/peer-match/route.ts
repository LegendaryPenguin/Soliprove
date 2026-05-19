import { NextRequest, NextResponse } from "next/server";
import { matchPeers } from "@/lib/peer/similarity";
import type { FarmerInput, FieldProfile } from "@/types";

export async function POST(req: NextRequest) {
  const { field, input } = (await req.json()) as {
    field: FieldProfile;
    input: FarmerInput;
  };

  if (!field || !input) {
    return NextResponse.json({ error: "field and input required" }, { status: 400 });
  }

  return NextResponse.json(matchPeers(field, input));
}
