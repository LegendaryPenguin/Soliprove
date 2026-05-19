import { NextResponse } from "next/server";
import { DEERE_API_BASE, isDeereEnabled } from "@/lib/deere/config";
import { getDeereSession } from "@/lib/deere/session";

export async function GET() {
  if (!isDeereEnabled()) {
    return NextResponse.json({ fields: [], demo: true });
  }

  const session = await getDeereSession();
  if (!session) {
    return NextResponse.json({ error: "Not connected" }, { status: 401 });
  }

  try {
    const orgRes = await fetch(`${DEERE_API_BASE}/organizations`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        Accept: "application/vnd.deere.axiom.v3+json",
      },
    });

    if (!orgRes.ok) throw new Error("Organizations fetch failed");

    const orgData = await orgRes.json();
    const orgs = orgData.values ?? orgData ?? [];

    const fields: Array<{
      id: string;
      name: string;
      acres?: number;
      orgName?: string;
    }> = [];

    for (const org of orgs.slice(0, 3)) {
      const orgId = org.id ?? org["@id"]?.split("/").pop();
      if (!orgId) continue;
      const fieldsRes = await fetch(
        `${DEERE_API_BASE}/organizations/${orgId}/fields`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            Accept: "application/vnd.deere.axiom.v3+json",
          },
        }
      );
      if (!fieldsRes.ok) continue;
      const fieldData = await fieldsRes.json();
      const list = fieldData.values ?? fieldData ?? [];
      for (const f of list.slice(0, 20)) {
        fields.push({
          id: String(f.id ?? f["@id"]),
          name: f.name ?? "Unnamed field",
          acres: f.acres,
          orgName: org.name,
        });
      }
    }

    return NextResponse.json({ fields });
  } catch {
    return NextResponse.json({
      fields: [
        {
          id: "demo-field-1",
          name: "Demo Corn Field A",
          acres: 40,
          orgName: "Demo Farm (API unavailable)",
        },
      ],
      demo: true,
    });
  }
}
