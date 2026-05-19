import type { FarmerInput, SoilTest } from "@/types";

export function recommendP(
  soilP: number | undefined,
  yieldGoal: number,
  hasSoilTest: boolean
): number {
  const maintenance = yieldGoal * 0.37;

  if (!hasSoilTest) return Math.round(maintenance * 0.9);
  const p = soilP ?? 25;
  if (p < 15) return Math.round(maintenance * 1.4);
  if (p < 25) return Math.round(maintenance * 1.15);
  if (p < 40) return Math.round(maintenance);
  if (p < 60) return Math.round(maintenance * 0.5);
  return 0;
}

export function recommendK(
  soilK: number | undefined,
  yieldGoal: number,
  hasSoilTest: boolean
): number {
  const maintenance = yieldGoal * 0.27;

  if (!hasSoilTest) return Math.round(maintenance * 0.92);
  const k = soilK ?? 150;
  if (k < 120) return Math.round(maintenance * 1.35);
  if (k < 160) return Math.round(maintenance * 1.1);
  if (k < 220) return Math.round(maintenance);
  if (k < 280) return Math.round(maintenance * 0.55);
  return Math.round(maintenance * 0.25);
}

export function getYieldGoal(
  input: FarmerInput,
  countyBenchmark?: number
): number {
  return input.yieldGoal ?? countyBenchmark ?? 200;
}

export function hasSoilTest(test?: SoilTest): boolean {
  return Boolean(
    test &&
      (test.phosphorusPpm !== undefined ||
        test.potassiumPpm !== undefined ||
        test.ph !== undefined)
  );
}
