import { clamp } from "@/lib/utils";
import type { FarmerInput, FieldProfile } from "@/types";

const STATE_BASE_RATES: Record<string, number> = {
  IL: 168,
  IA: 165,
  IN: 162,
  OH: 160,
  MN: 155,
  WI: 158,
  NE: 170,
  KS: 175,
  MO: 168,
  DEFAULT: 165,
};

export function getBaseMRTNLikeRate(
  state: string,
  rotation: FarmerInput["rotation"]
): number {
  const base = STATE_BASE_RATES[state.toUpperCase()] ?? STATE_BASE_RATES.DEFAULT;
  return rotation === "corn_after_corn" ? base + 25 : base;
}

export type NitrogenInput = {
  state: string;
  rotation: FarmerInput["rotation"];
  cornPricePerBu: number;
  nitrogenPricePerLb: number;
  organicMatter?: number;
  weatherRisk?: "normal" | "wet_spring" | "dry";
};

export function recommendNitrogen(input: NitrogenInput): number {
  const baseRate = getBaseMRTNLikeRate(input.state, input.rotation);
  const priceRatio = input.nitrogenPricePerLb / input.cornPricePerBu;

  let rate = baseRate;

  if (priceRatio > 0.2) rate -= 20;
  else if (priceRatio > 0.15) rate -= 10;

  if (input.rotation === "corn_after_corn") rate += 30;
  if ((input.organicMatter ?? 0) > 4) rate -= 8;
  if (input.weatherRisk === "wet_spring") rate += 8;
  if (input.weatherRisk === "dry") rate -= 5;

  return Math.round(clamp(rate, baseRate - 35, baseRate + 35));
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
