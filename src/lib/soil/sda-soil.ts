/**
 * Best-effort live USDA Soil Data Access (SDA / SSURGO) point enrichment.
 *
 * This helper isolates all live SDA logic so /api/soil/route.ts can remain a
 * thin try-live → fall-back-cleanly wrapper. SDA exposes a public REST query
 * endpoint backed by the SSURGO map unit / component / horizon tables:
 *   https://sdmdataaccess.sc.egov.usda.gov/Tabular/post.rest
 *
 * We submit a point intersect query against the mupolygon table and pull the
 * dominant component plus its surface horizon to derive drainage, hydrologic
 * group, available water capacity, and an organic-matter estimate. Anything
 * SDA does not return cleanly is left undefined so the caller can decide
 * whether to fall back.
 */

export type SdaSoilResult = {
  mapUnitKey?: string;
  mapUnitName?: string;
  soilSeries?: string;
  texture?: string;
  slope?: string;
  drainageClass?: string;
  hydrologicGroup?: string;
  availableWaterCapacity?: string;
  organicMatterEstimate?: number;
  confidence: "high" | "medium" | "low";
  source: "USDA_NRCS_SSURGO";
  live: true;
  note: string;
};

const SDA_ENDPOINT =
  "https://sdmdataaccess.sc.egov.usda.gov/Tabular/post.rest";

const DEFAULT_TIMEOUT_MS = 6000;

type SdaRow = (string | null)[];

type SdaResponse = {
  Table?: SdaRow[];
};

function buildPointQuery(lat: number, lon: number): string {
  // SELECT dominant component + surface horizon at the lat/lon point.
  // Numbers are inlined as plain decimals — Soil Data Access expects WKT
  // string literals inside the SQL body.
  return `
    SELECT TOP 1
      CAST(m.mukey AS varchar(20))            AS mukey,
      m.muname                                 AS muname,
      c.compname                               AS compname,
      c.comppct_r                              AS comppct_r,
      c.drainagecl                             AS drainagecl,
      c.hydgrp                                 AS hydgrp,
      c.slope_r                                AS slope_r,
      ch.texture                               AS texture,
      ch.om_r                                  AS om_r,
      ch.awc_r                                 AS awc_r
    FROM mupolygon AS p
    INNER JOIN mapunit  AS m  ON m.mukey  = p.mukey
    LEFT OUTER JOIN component AS c ON c.mukey  = m.mukey AND c.majcompflag = 'Yes'
    LEFT OUTER JOIN chtexturegrp AS ctg ON 1 = 0
    LEFT OUTER JOIN chorizon  AS ch ON ch.cokey = c.cokey
    WHERE mupolygongeo.STIntersects(
      geometry::STGeomFromText('POINT(${lon} ${lat})', 4326)
    ) = 1
    ORDER BY c.comppct_r DESC, ch.hzdept_r ASC
  `;
}

function buildPointQuerySimple(lat: number, lon: number): string {
  // Backup query — texture join above is conservative; this version omits the
  // chtexturegrp dance for environments where SDA times out on the broader
  // query.
  return `
    SELECT TOP 1
      CAST(m.mukey AS varchar(20))            AS mukey,
      m.muname                                 AS muname,
      c.compname                               AS compname,
      c.comppct_r                              AS comppct_r,
      c.drainagecl                             AS drainagecl,
      c.hydgrp                                 AS hydgrp,
      c.slope_r                                AS slope_r,
      ch.om_r                                  AS om_r,
      ch.awc_r                                 AS awc_r
    FROM mupolygon AS p
    INNER JOIN mapunit AS m ON m.mukey = p.mukey
    LEFT OUTER JOIN component AS c ON c.mukey = m.mukey AND c.majcompflag = 'Yes'
    LEFT OUTER JOIN chorizon  AS ch ON ch.cokey = c.cokey
    WHERE mupolygongeo.STIntersects(
      geometry::STGeomFromText('POINT(${lon} ${lat})', 4326)
    ) = 1
    ORDER BY c.comppct_r DESC, ch.hzdept_r ASC
  `;
}

async function runSdaQuery(
  query: string,
  signal: AbortSignal
): Promise<SdaResponse | null> {
  const res = await fetch(SDA_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ format: "JSON+COLUMNNAME", query }),
    signal,
  });
  if (!res.ok) return null;
  const data = (await res.json()) as SdaResponse;
  return data ?? null;
}

function parseRow(table: SdaRow[] | undefined): Record<string, string | null> | null {
  if (!table || table.length < 2) return null;
  const cols = table[0] as unknown as string[];
  const row = table[1];
  const obj: Record<string, string | null> = {};
  cols.forEach((c, i) => {
    obj[c] = row[i];
  });
  return obj;
}

function formatAwc(awcStr: string | null | undefined): string | undefined {
  if (awcStr == null) return undefined;
  const num = Number(awcStr);
  if (!Number.isFinite(num)) return undefined;
  return `${num.toFixed(2)} in/in`;
}

function formatSlope(slopeStr: string | null | undefined): string | undefined {
  if (slopeStr == null) return undefined;
  const num = Number(slopeStr);
  if (!Number.isFinite(num)) return undefined;
  if (num <= 2) return "0–2%";
  if (num <= 5) return "2–5%";
  if (num <= 9) return "5–9%";
  return `${num.toFixed(0)}%`;
}

function parseNumber(s: string | null | undefined): number | undefined {
  if (s == null) return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

/**
 * Try to fetch a live SSURGO-backed soil context for a point. Returns null
 * (rather than throwing) if SDA is unreachable, the response is empty, or no
 * usable map unit was returned. Callers should treat null as "fall back".
 */
export async function fetchSdaSoilContext(
  lat: number,
  lon: number,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<SdaSoilResult | null> {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), timeoutMs);

  try {
    let resp = await runSdaQuery(buildPointQuery(lat, lon), controller.signal);
    let row = parseRow(resp?.Table);

    if (!row || !row.mukey) {
      resp = await runSdaQuery(buildPointQuerySimple(lat, lon), controller.signal);
      row = parseRow(resp?.Table);
    }

    if (!row || !row.mukey) return null;

    const mapUnitKey = row.mukey ?? undefined;
    const mapUnitName = row.muname ?? undefined;
    const soilSeries = row.compname ?? undefined;
    const drainageClass = row.drainagecl ?? undefined;
    const hydrologicGroup = row.hydgrp ?? undefined;
    const slope = formatSlope(row.slope_r);
    const availableWaterCapacity = formatAwc(row.awc_r);
    const organicMatterEstimate = parseNumber(row.om_r);

    // Confidence: if we got map unit + component + drainage, treat as high.
    // If only map unit + name, medium.
    const hasComponentDepth =
      Boolean(soilSeries) && Boolean(drainageClass) && Boolean(hydrologicGroup);
    const confidence: SdaSoilResult["confidence"] = hasComponentDepth
      ? "high"
      : "medium";

    return {
      mapUnitKey,
      mapUnitName: mapUnitName ?? undefined,
      soilSeries: soilSeries ?? undefined,
      texture: row.texture ?? undefined,
      slope,
      drainageClass: drainageClass ?? undefined,
      hydrologicGroup: hydrologicGroup ?? undefined,
      availableWaterCapacity,
      organicMatterEstimate,
      confidence,
      source: "USDA_NRCS_SSURGO",
      live: true,
      note: "Live USDA SDA/SSURGO enrichment at requested point.",
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutHandle);
  }
}
