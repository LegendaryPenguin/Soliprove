import type {
  ConfidenceBreakdown,
  ConfidenceLevel,
  FarmerInput,
  FieldProfile,
  Recommendation,
} from "@/types";
import { hasSoilTest } from "./pk";

export function scoreToLabel(score: number): ConfidenceLevel {
  if (score >= 75) return "high";
  if (score >= 50) return "medium";
  return "low";
}

export function calculateConfidence(
  field: FieldProfile | undefined,
  input: FarmerInput,
  recommendation: Pick<Recommendation, "nRate" | "p2o5Rate" | "k2oRate">,
  peerCount: number
): ConfidenceBreakdown {
  const soilTestScore = hasSoilTest(input.soilTest) ? 30 : 5;

  let soilDataScore = 5;
  if (field?.soil?.confidence === "high") soilDataScore = 20;
  else if (field?.soil?.confidence === "medium") soilDataScore = 12;
  else if (field?.soil) soilDataScore = 8;

  const peerMatchScore = Math.min(25, Math.round(peerCount * 3));

  let weatherScore = 6;
  if (field?.weather?.droughtRisk === "low") weatherScore = 10;
  else if (field?.weather?.droughtRisk === "moderate") weatherScore = 8;

  const nReduction =
    ((input.currentNRate - recommendation.nRate) / input.currentNRate) * 100;
  let conservativeReductionScore = 8;
  if (nReduction <= 15 && nReduction >= 0) conservativeReductionScore = 15;
  else if (nReduction > 25) conservativeReductionScore = 4;

  const total = Math.min(
    100,
    soilTestScore +
      soilDataScore +
      peerMatchScore +
      weatherScore +
      conservativeReductionScore
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
