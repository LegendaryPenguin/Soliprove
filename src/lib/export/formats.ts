import type { FieldProfile, FarmerInput, Recommendation, PeerMatchResult } from "@/types";

export function recommendationToCsv(rec: Recommendation): string {
  const header =
    "zone,acres,n_rate_lb_ac,p2o5_rate_lb_ac,k2o_rate_lb_ac,confidence";
  const rows = rec.zones.map(
    (z) =>
      `${z.zone},${z.acres},${z.nRate},${z.p2o5Rate},${z.k2oRate},${z.confidence}`
  );
  return [header, ...rows].join("\n");
}

export function recommendationToGeoJSON(
  rec: Recommendation,
  field?: FieldProfile
): GeoJSON.FeatureCollection {
  const features: GeoJSON.Feature[] = rec.zones
    .filter((z) => z.geometry)
    .map((z) => ({
      type: "Feature" as const,
      properties: {
        zone: z.zone,
        acres: z.acres,
        n_rate: z.nRate,
        p2o5_rate: z.p2o5Rate,
        k2o_rate: z.k2oRate,
        confidence: z.confidence,
        reason: z.reason,
      },
      geometry: z.geometry!,
    }));

  if (features.length === 0 && field?.boundary) {
    return field.boundary;
  }

  return { type: "FeatureCollection", features };
}

export function buildReportText(
  field: FieldProfile,
  input: FarmerInput,
  rec: Recommendation,
  peers?: PeerMatchResult
): string {
  const lines = [
    "SOILPROVE — FIELD PRESCRIPTION REPORT",
    "=====================================",
    "",
    "1. FIELD SUMMARY",
    `   Location: ${field.county} County, ${field.state}`,
    `   Acres: ${field.acres}`,
    `   Primary soil: ${field.soil?.mapUnitName ?? "—"}`,
    "",
    "2. DATA SOURCES",
    `   Soil: ${field.soil?.source ?? "—"}`,
    `   Yield benchmark: ${field.cropBenchmark?.source ?? "—"}`,
    `   Weather: ${field.weather?.source ?? "—"}`,
    `   Prices: ${field.fertilizerPrices?.source ?? "—"}`,
    "",
    "3. RECOMMENDED PRESCRIPTION",
    `   Nitrogen: ${rec.nRate} lb N/ac`,
    `   Phosphorus: ${rec.p2o5Rate} lb P2O5/ac`,
    `   Potassium: ${rec.k2oRate} lb K2O/ac`,
    "",
    "4. SAVINGS ESTIMATE",
    `   Per acre: $${rec.savingsPerAcre.toFixed(2)}`,
    `   Total field: $${rec.totalSavings.toFixed(2)}`,
    "",
    "5. YIELD-RISK CONFIDENCE",
    `   Score: ${rec.confidenceScore}/100 (${rec.confidenceLabel})`,
    "",
    "6. PEER VALIDATION",
    peers
      ? `   ${peers.count} similar fields; avg N reduction ${peers.averageNReduction} lb/ac`
      : "   Not run",
    "",
    "7. METHODOLOGY",
    "   MRTN-inspired N; soil-test-based P/K when available.",
    "",
    "8. DISCLAIMER",
    "   SoilProve is a decision-support tool. Final fertilizer decisions",
    "   should be reviewed with a certified crop adviser or local extension",
    "   recommendation, especially when no current soil test is available.",
  ];
  return lines.join("\n");
}
