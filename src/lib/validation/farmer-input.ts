import { z } from "zod";

export const farmerInputSchema = z.object({
  rotation: z.enum(["corn_after_soybean", "corn_after_corn"]),
  cornPricePerBu: z.number().min(0).max(20),
  nitrogenProduct: z.enum(["anhydrous", "uan28", "uan32", "urea"]),
  nitrogenPricePerTon: z.number().min(0).max(5000).optional(),
  currentNRate: z.number().min(0).max(400),
  currentP2O5Rate: z.number().min(0).max(400),
  currentK2ORate: z.number().min(0).max(400),
  soilTest: z
    .object({
      ph: z.number().min(4).max(9).optional(),
      organicMatterPct: z.number().min(0).max(15).optional(),
      phosphorusPpm: z.number().min(0).max(500).optional(),
      potassiumPpm: z.number().min(0).max(1000).optional(),
    })
    .optional(),
});

export function validateFarmerInput(
  input: unknown
): { ok: true } | { ok: false; message: string } {
  const result = farmerInputSchema.safeParse(input);
  if (result.success) return { ok: true };
  const first = result.error.issues[0];
  return {
    ok: false,
    message: first?.message ?? "Invalid farm inputs",
  };
}
