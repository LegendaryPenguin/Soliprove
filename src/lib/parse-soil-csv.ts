import type { SoilTest } from "@/types";

/** Parse simple soil lab CSV with headers like pH, P, K, OM */
export function parseSoilTestCsv(text: string): SoilTest {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) throw new Error("CSV needs header + data row");

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const values = lines[1].split(",").map((v) => v.trim());

  const get = (...names: string[]) => {
    for (const n of names) {
      const i = headers.findIndex((h) => h.includes(n));
      if (i >= 0 && values[i]) return parseFloat(values[i]);
    }
    return undefined;
  };

  return {
    ph: get("ph"),
    organicMatterPct: get("om", "organic"),
    phosphorusPpm: get("p", "phosphorus", "p_ppm"),
    potassiumPpm: get("k", "potassium", "k_ppm"),
    cec: get("cec"),
    nitrateN: get("nitrate", "no3"),
  };
}
