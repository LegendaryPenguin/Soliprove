import type { FarmerInput, FieldProfile, Recommendation } from "@/types";
import { calculateConfidence, scoreToLabel } from "./confidence";
import { hasSoilTest, getYieldGoal, recommendK, recommendP } from "./pk";
import { calculateSavings } from "./savings";
import {
  nitrogenPricePerLbFromFarmer,
  recommendNitrogen,
  weatherRiskFromProfile,
} from "./nitrogen";
import { createZonesForField } from "@/lib/geo/zones";

export function buildRecommendation(
  field: FieldProfile,
  input: FarmerInput,
  peerCount = 7
): Recommendation {
  const yieldGoal = getYieldGoal(
    input,
    field.cropBenchmark?.countyCornYieldBuAc
  );
  const nPrice = nitrogenPricePerLbFromFarmer(input);
  const hasTest = hasSoilTest(input.soilTest);

  const nRate = recommendNitrogen({
    state: field.state,
    rotation: input.rotation,
    cornPricePerBu: input.cornPricePerBu,
    nitrogenPricePerLb: nPrice,
    organicMatter:
      input.soilTest?.organicMatterPct ?? field.soil?.organicMatterEstimate,
    weatherRisk: weatherRiskFromProfile(field),
    drainageClass: field.soil?.drainageClass,
  });

  const p2o5Rate = recommendP(
    input.soilTest?.phosphorusPpm,
    yieldGoal,
    hasTest
  );
  const k2oRate = recommendK(
    input.soilTest?.potassiumPpm,
    yieldGoal,
    hasTest
  );

  const { savingsPerAcre, totalSavings } = calculateSavings(
    input,
    nRate,
    p2o5Rate,
    k2oRate,
    field.acres
  );

  const zoneRates = [
    {
      zone: "A",
      n: Math.round(nRate * 1.08),
      p: Math.round(p2o5Rate * 1.55),
      k: Math.round(k2oRate * 1.36),
      confidence: "medium" as const,
      reason: "Lower P confidence without zone soil test",
    },
    {
      zone: "B",
      n: nRate,
      p: Math.round(p2o5Rate * 0.83),
      k: Math.round(k2oRate * 0.91),
      confidence: "high" as const,
      reason: "High soil K — maintenance application sufficient",
    },
    {
      zone: "C",
      n: Math.round(nRate * 0.92),
      p: Math.round(p2o5Rate * 0.48),
      k: Math.round(k2oRate * 0.73),
      confidence: "high" as const,
      reason: "High P/K + stable soil series",
    },
  ];

  const zoneGeometries = createZonesForField(
    field.lat,
    field.lon,
    field.acres,
    field.boundary
  );

  const zones = zoneRates.slice(0, zoneGeometries.length).map((z, i) => ({
    zone: z.zone,
    acres: zoneGeometries[i]?.acres ?? field.acres / zoneGeometries.length,
    nRate: z.n,
    p2o5Rate: z.p,
    k2oRate: z.k,
    confidence: z.confidence,
    reason: z.reason,
    geometry: zoneGeometries[i]?.geometry,
  }));

  const draft = { nRate, p2o5Rate, k2oRate };
  const confidenceBreakdown = calculateConfidence(
    field,
    input,
    draft,
    peerCount
  );

  const explanation: string[] = [
    `MRTN-inspired nitrogen estimate for ${field.state} with ${input.rotation.replace(/_/g, " ")} rotation.`,
    field.boundary
      ? "Management zones follow your drawn field boundary."
      : "Uniform zones until a field boundary is drawn.",
    hasTest
      ? "P and K rates use your soil test categories and crop removal logic."
      : "Without a soil test, P and K use conservative maintenance estimates.",
  ];

  if (input.currentNRate > nRate) {
    explanation.push(
      `Nitrogen reduced ${input.currentNRate - nRate} lb/ac based on economics and field context.`
    );
  }

  return {
    nRate,
    p2o5Rate,
    k2oRate,
    savingsPerAcre,
    totalSavings,
    confidenceScore: confidenceBreakdown.total,
    confidenceLabel: scoreToLabel(confidenceBreakdown.total),
    confidenceBreakdown,
    explanation,
    zones,
  };
}
