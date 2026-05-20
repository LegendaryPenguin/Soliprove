import { clamp } from "@/lib/utils";
import type { FarmerInput, FieldProfile } from "@/types";
import { getMrtnPrior } from "./mrtn-priors";

export type NitrogenInput = {
  state: string;
  rotation: FarmerInput["rotation"];
  cornPricePerBu: number;
  nitrogenPricePerLb: number;
  organicMatter?: number;
  weatherRisk?: "normal" | "wet_spring" | "dry";
  drainageClass?: string;
};

/**
 * Prototype MRTN-style nitrogen decision engine.
 *
 * Flow:
 *   1. Compute price ratio = $/lb N ÷ $/bu corn
 *   2. Select a prototype prior (state × rotation × price band) that exposes a
 *      profitable range [L, M, H]
 *   3. Compute a bounded weather + drainage bias in [-0.35, +0.35]
 *   4. Position the final rate inside the profitable range:
 *        bias ≥ 0 → M + bias·(H − M)
 *        bias < 0 → M + bias·(M − L)
 *   5. Return Math.round(rate), clamped to [L, H]
 *
 * Bias coefficients are transparent demonstration heuristics, not official
 * agronomic coefficients. See docs/DECISION_ENGINE.md and
 * docs/SCIENTIFIC_BASIS.md for context.
 */
export function recommendNitrogen(input: NitrogenInput): number {
  const priceRatio = input.nitrogenPricePerLb / input.cornPricePerBu;
  const prior = getMrtnPrior(input.state, input.rotation, priceRatio);

  const L = prior.profitableLow;
  const M = prior.mrtnRate;
  const H = prior.profitableHigh;

  let weatherBias = 0;
  if (input.weatherRisk === "wet_spring") weatherBias = 0.2;
  else if (input.weatherRisk === "dry") weatherBias = -0.1;

  let drainageBias = 0;
  const drainage = input.drainageClass?.toLowerCase();
  if (drainage) {
    // Ordering matters: check "somewhat poorly" before the broader "poorly".
    if (drainage.includes("somewhat poorly")) drainageBias = 0.08;
    else if (drainage.includes("very poorly")) drainageBias = 0.15;
    else if (drainage.includes("poorly")) drainageBias = 0.15;
    else if (drainage.includes("moderately well")) drainageBias = 0;
    else if (drainage.includes("well drained")) drainageBias = 0;
  }

  let bias = weatherBias + drainageBias;
  bias = clamp(bias, -0.35, 0.35);

  const rate = bias >= 0 ? M + bias * (H - M) : M + bias * (M - L);

  return clamp(Math.round(rate), L, H);
}

export function nitrogenPricePerLbFromFarmer(input: FarmerInput): number {
  if (input.nitrogenPricePerLb) return input.nitrogenPricePerLb;

  const perTon = input.nitrogenPricePerTon ?? 650;
  const productFactor: Record<FarmerInput["nitrogenProduct"], number> = {
    anhydrous: 0.82,
    uan28: 0.28,
    uan32: 0.32,
    urea: 0.46,
  };
  const nFraction = productFactor[input.nitrogenProduct];
  return perTon / 2000 / nFraction;
}

export function weatherRiskFromProfile(
  field?: FieldProfile
): NitrogenInput["weatherRisk"] {
  const risk = field?.weather?.droughtRisk;
  if (risk === "elevated") return "dry";
  if (field?.weather?.recentRainfallIn && field.weather.recentRainfallIn > 4)
    return "wet_spring";
  return "normal";
}
