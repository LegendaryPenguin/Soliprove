import type { FarmerInput } from "@/types";

/**
 * Prototype MRTN-style economic prior table.
 *
 * These priors are a transparent demonstration scaffold for the SoilProve
 * hackathon decision engine. They preserve the legacy demo's state-baseline
 * behavior while moving the engine to a price-aware "profitable range"
 * architecture similar in spirit to the public Corn Nitrogen Rate Calculator
 * (https://www.cornnratecalc.org/). They are NOT official MRTN outputs.
 *
 * The prior table is intentionally isolated in this file so that a production
 * deployment can swap in validated agronomic priors (or a licensed dataset /
 * direct calculator integration) without touching the rest of the engine.
 */

export type PriceBand = "low" | "mid" | "high";

export type MrtnPrior = {
  state: string;
  rotation: FarmerInput["rotation"];
  priceBand: PriceBand;
  mrtnRate: number;
  profitableLow: number;
  profitableHigh: number;
  note?: string;
};

// These price bands are transparent prototype bins for the hackathon
// implementation, used to select embedded MRTN-style priors. A production
// implementation should replace these with validated agronomic lookup data or
// a licensed/direct calculator dataset.
export function classifyPriceBand(priceRatio: number): PriceBand {
  if (priceRatio < 0.1) return "low";
  if (priceRatio < 0.16) return "mid";
  return "high";
}

type RotationKey = FarmerInput["rotation"];

type StateBlock = Record<RotationKey, Record<PriceBand, Omit<MrtnPrior, "state" | "rotation" | "priceBand">>>;

/**
 * State priors are calibrated so that:
 *  - the LOW price band center ≈ the previous engine's state baseline (continuity anchor)
 *  - the MID price band center is modestly lower
 *  - the HIGH price band center is materially lower
 *  - corn-after-corn centers sit meaningfully (~25 lb) above corn-after-soybean,
 *    preserving the old rotation bump in spirit
 *  - every prior satisfies profitableLow < mrtnRate < profitableHigh
 *
 * Numbers are demonstration heuristics, not official MRTN results.
 */
const PRIORS: Record<string, StateBlock> = {
  IL: {
    corn_after_soybean: {
      low: { mrtnRate: 168, profitableLow: 148, profitableHigh: 188 },
      mid: { mrtnRate: 158, profitableLow: 140, profitableHigh: 178 },
      high: { mrtnRate: 145, profitableLow: 128, profitableHigh: 165 },
    },
    corn_after_corn: {
      low: { mrtnRate: 193, profitableLow: 173, profitableHigh: 213 },
      mid: { mrtnRate: 183, profitableLow: 163, profitableHigh: 203 },
      high: { mrtnRate: 170, profitableLow: 150, profitableHigh: 190 },
    },
  },
  IA: {
    corn_after_soybean: {
      low: { mrtnRate: 165, profitableLow: 145, profitableHigh: 185 },
      mid: { mrtnRate: 155, profitableLow: 137, profitableHigh: 175 },
      high: { mrtnRate: 142, profitableLow: 125, profitableHigh: 162 },
    },
    corn_after_corn: {
      low: { mrtnRate: 190, profitableLow: 170, profitableHigh: 210 },
      mid: { mrtnRate: 180, profitableLow: 160, profitableHigh: 200 },
      high: { mrtnRate: 167, profitableLow: 147, profitableHigh: 187 },
    },
  },
  IN: {
    corn_after_soybean: {
      low: { mrtnRate: 162, profitableLow: 142, profitableHigh: 182 },
      mid: { mrtnRate: 152, profitableLow: 134, profitableHigh: 172 },
      high: { mrtnRate: 140, profitableLow: 122, profitableHigh: 160 },
    },
    corn_after_corn: {
      low: { mrtnRate: 187, profitableLow: 167, profitableHigh: 207 },
      mid: { mrtnRate: 177, profitableLow: 157, profitableHigh: 197 },
      high: { mrtnRate: 165, profitableLow: 145, profitableHigh: 185 },
    },
  },
  MO: {
    corn_after_soybean: {
      low: { mrtnRate: 168, profitableLow: 148, profitableHigh: 188 },
      mid: { mrtnRate: 158, profitableLow: 140, profitableHigh: 178 },
      high: { mrtnRate: 145, profitableLow: 128, profitableHigh: 165 },
    },
    corn_after_corn: {
      low: { mrtnRate: 193, profitableLow: 173, profitableHigh: 213 },
      mid: { mrtnRate: 183, profitableLow: 163, profitableHigh: 203 },
      high: { mrtnRate: 170, profitableLow: 150, profitableHigh: 190 },
    },
  },
  DEFAULT: {
    corn_after_soybean: {
      low: { mrtnRate: 165, profitableLow: 145, profitableHigh: 185 },
      mid: { mrtnRate: 155, profitableLow: 137, profitableHigh: 175 },
      high: { mrtnRate: 142, profitableLow: 125, profitableHigh: 162 },
    },
    corn_after_corn: {
      low: { mrtnRate: 190, profitableLow: 170, profitableHigh: 210 },
      mid: { mrtnRate: 180, profitableLow: 160, profitableHigh: 200 },
      high: { mrtnRate: 167, profitableLow: 147, profitableHigh: 187 },
    },
  },
};

export function getMrtnPrior(
  state: string,
  rotation: FarmerInput["rotation"],
  priceRatio: number
): MrtnPrior {
  const priceBand = classifyPriceBand(priceRatio);
  const upper = (state ?? "").toUpperCase();
  const block = PRIORS[upper] ?? PRIORS.DEFAULT;
  const entry = block[rotation][priceBand];
  return {
    state: PRIORS[upper] ? upper : "DEFAULT",
    rotation,
    priceBand,
    mrtnRate: entry.mrtnRate,
    profitableLow: entry.profitableLow,
    profitableHigh: entry.profitableHigh,
    note:
      "Prototype MRTN-style prior — demonstration heuristic, not an official agronomic recommendation.",
  };
}
