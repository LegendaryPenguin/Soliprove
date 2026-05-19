"use client";

import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WizardStep } from "@/types";

const COACH_TIPS: Record<
  WizardStep,
  { title: string; body: string; highlight?: string }
> = {
  field: {
    title: "Place your field",
    body: "Use satellite view, drag the pin, draw your boundary, or upload GeoJSON. Acres update automatically.",
    highlight: "map",
  },
  context: {
    title: "Review auto-loaded data",
    body: "SoilProve pulled USDA soil, NASS yield, weather, and regional fertilizer defaults for this location.",
  },
  input: {
    title: "Your farm economics",
    body: "Only enter what we cannot infer — rotation, prices, and current flat rates. Soil test is optional but improves P/K.",
    highlight: "rotation",
  },
  results: {
    title: "Your prescription",
    body: "Compare current vs recommended rates. Green zones have higher confidence; red means get a soil test before cutting hard.",
  },
  peers: {
    title: "Nearby proof",
    body: "Similar fields in your region that reduced N without reported yield loss — builds confidence before you apply.",
  },
  export: {
    title: "Take it to the field",
    body: "Download CSV/GeoJSON/PDF or connect John Deere Operations Center to push the plan.",
  },
};

export function WizardCoach({
  step,
  subStep,
}: {
  step: WizardStep;
  subStep?: string;
}) {
  const tip = COACH_TIPS[step];

  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg border border-[#F2C94C]/50 bg-gradient-to-r from-[#FAF7EF] to-white px-4 py-3 shadow-sm",
        subStep && "ring-2 ring-[#1F6F43]/20"
      )}
      data-coach-highlight={tip.highlight}
    >
      <Lightbulb className="h-5 w-5 shrink-0 text-[#8B5E3C] mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-[#123524]">{tip.title}</p>
        <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">{tip.body}</p>
        {subStep && (
          <p className="text-xs text-[#1F6F43] mt-1 font-medium">{subStep}</p>
        )}
      </div>
    </div>
  );
}
