import type { FarmerInput } from "@/types";
import { nitrogenPricePerLbFromFarmer } from "./nitrogen";

const P2O5_COST_PER_LB = 0.52;
const K2O_COST_PER_LB = 0.38;

export function calculateSavings(
  input: FarmerInput,
  nRate: number,
  p2o5Rate: number,
  k2oRate: number,
  acres: number
): { savingsPerAcre: number; totalSavings: number } {
  const nPrice = nitrogenPricePerLbFromFarmer(input);

  const currentCost =
    input.currentNRate * nPrice +
    input.currentP2O5Rate * P2O5_COST_PER_LB +
    input.currentK2ORate * K2O_COST_PER_LB;

  const recommendedCost =
    nRate * nPrice + p2o5Rate * P2O5_COST_PER_LB + k2oRate * K2O_COST_PER_LB;

  const savingsPerAcre = Math.max(0, currentCost - recommendedCost);
  return {
    savingsPerAcre: Math.round(savingsPerAcre * 100) / 100,
    totalSavings: Math.round(savingsPerAcre * acres * 100) / 100,
  };
}
