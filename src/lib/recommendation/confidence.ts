import type {
  ConfidenceBreakdown,
  ConfidenceLevel,
  FarmerInput,
  FieldProfile,
  Recommendation,
} from "@/types";

export function scoreToLabel(score: number): ConfidenceLevel {
  if (score >= 75) return "high";
  if (score >= 50) return "medium";
  return "low";
}

function cap(score: number, max: number): number {
  return Math.min(max, Math.max(0, score));
}

export function calculateConfidence(
  field: FieldProfile | undefined,
  input: FarmerInput,
  recommendation: Pick<Recommendation, "nRate" | "p2o5Rate" | "k2oRate">,
  peerCount: number
): ConfidenceBreakdown {
  const test = input.soilTest;
  const hasAnySoilTestData = Boolean(
    test &&
      (test.phosphorusPpm !== undefined ||
        test.potassiumPpm !== undefined ||
        test.organicMatterPct !== undefined ||
        test.ph !== undefined ||
        test.cec !== undefined ||
        test.nitrateN !== undefined)
  );

  let soilTestScore = 5;
  if (hasAnySoilTestData && test) {
    soilTestScore = 0;
    if (test.phosphorusPpm !== undefined) soilTestScore += 10;
    if (test.potassiumPpm !== undefined) soilTestScore += 10;
    if (test.organicMatterPct !== undefined) soilTestScore += 5;
    if (test.ph !== undefined) soilTestScore += 3;
    if (test.cec !== undefined || test.nitrateN !== undefined) soilTestScore += 2;
    soilTestScore = cap(soilTestScore, 30);
  }

  let soilDataScore = 0;
  if (field?.soil) {
    soilDataScore += 6;
    if (field.soil.confidence === "high") soilDataScore += 4;
    else if (field.soil.confidence === "medium") soilDataScore += 2;
    if (field.soil.drainageClass) soilDataScore += 3;
    if (field.soil.hydrologicGroup) soilDataScore += 3;
    if (field.soil.soilSeries || field.soil.mapUnitName) soilDataScore += 2;
    if (
      field.soil.organicMatterEstimate !== undefined ||
      field.soil.availableWaterCapacity
    ) {
      soilDataScore += 2;
    }
  }
  soilDataScore = cap(soilDataScore, 20);

  let peerMatchScore = 0;
  if (peerCount > 10) peerMatchScore = 25;
  else if (peerCount >= 8) peerMatchScore = 23;
  else if (peerCount >= 5) peerMatchScore = 19;
  else if (peerCount >= 3) peerMatchScore = 14;
  else if (peerCount >= 1) peerMatchScore = 8;

  let weatherScore = 0;
  if (field?.weather) {
    weatherScore += 4;
    if (field.weather.recentRainfallIn !== undefined) weatherScore += 3;
    if (field.weather.droughtRisk !== undefined) weatherScore += 3;
  }
  weatherScore = cap(weatherScore, 10);

  let conservativeReductionScore = 5;
  if (input.currentNRate > 0) {
    const nReductionPercent =
      ((input.currentNRate - recommendation.nRate) / input.currentNRate) * 100;

    if (nReductionPercent < 0) conservativeReductionScore = 8;
    else if (nReductionPercent <= 10) conservativeReductionScore = 15;
    else if (nReductionPercent <= 18) conservativeReductionScore = 12;
    else if (nReductionPercent <= 25) conservativeReductionScore = 8;
    else if (nReductionPercent <= 35) conservativeReductionScore = 4;
    else conservativeReductionScore = 1;
  }

  const total = cap(
    soilTestScore +
      soilDataScore +
      peerMatchScore +
      weatherScore +
      conservativeReductionScore,
    100
  );

  return {
    soilTestScore,
    soilDataScore,
    peerMatchScore,
    weatherScore,
    conservativeReductionScore,
    total,
  };
}
