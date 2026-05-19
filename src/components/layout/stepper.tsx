import { cn } from "@/lib/utils";
import type { WizardStep } from "@/types";

const STEPS: { id: WizardStep; label: string }[] = [
  { id: "field", label: "Field" },
  { id: "context", label: "Context" },
  { id: "input", label: "Inputs" },
  { id: "results", label: "Prescription" },
  { id: "peers", label: "Peers" },
  { id: "export", label: "Export" },
];

export function Stepper({ current }: { current: WizardStep }) {
  const currentIndex = STEPS.findIndex((s) => s.id === current);

  return (
    <ol className="flex flex-wrap gap-2 text-xs sm:text-sm">
      {STEPS.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <li
            key={step.id}
            className={cn(
              "flex items-center gap-1 rounded-full px-3 py-1 border",
              done && "bg-[#1F6F43]/10 border-[#1F6F43]/30 text-[#1F6F43]",
              active && "bg-[#1F6F43] border-[#1F6F43] text-white font-medium",
              !done && !active && "border-[#E7E0D0] text-[#6B7280] bg-white"
            )}
          >
            <span className="hidden sm:inline">{i + 1}.</span> {step.label}
          </li>
        );
      })}
    </ol>
  );
}
