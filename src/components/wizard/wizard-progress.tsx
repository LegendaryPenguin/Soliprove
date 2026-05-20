"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { WIZARD_STEPS, getStepIndex, TOTAL_STEPS } from "@/lib/wizard/steps";
import type { WizardStep } from "@/types";

export function WizardProgress({ current }: { current: WizardStep }) {
  const currentIndex = getStepIndex(current);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="landing-display text-lg text-[#3D5C3A]">
          Step {currentIndex + 1} of {TOTAL_STEPS}
        </p>
        <p className="text-sm text-[#6B4E3D] hidden sm:block">
          {WIZARD_STEPS[currentIndex]?.label}
        </p>
      </div>

      <div className="relative">
        <div
          className="absolute top-5 left-0 right-0 h-1 bg-[#E7E0D0] hidden sm:block rounded-full"
          aria-hidden
        />
        <div
          className="absolute top-5 left-0 h-1 bg-[#4A6B45] hidden sm:block transition-all duration-300 rounded-full"
          style={{
            width:
              currentIndex === 0
                ? "0%"
                : `${(currentIndex / (TOTAL_STEPS - 1)) * 100}%`,
          }}
          aria-hidden
        />
        <ol className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-0">
          {WIZARD_STEPS.map((step, i) => {
            const done = i < currentIndex;
            const active = i === currentIndex;
            const upcoming = i > currentIndex;

            return (
              <li key={step.id} className="flex flex-col items-center text-center">
                <div
                  className={cn(
                    "relative z-10 flex h-10 w-10 items-center justify-center border-2 text-sm font-bold transition-all",
                    done &&
                      "border-[#3D5C3A] bg-[#4A6B45] text-white shadow-[2px_2px_0_#2d4529] rounded-[3px_8px_4px_6px]",
                    active &&
                      "border-[#3D5C3A] bg-[#F4EFE4] text-[#3D5C3A] ring-2 ring-[#4A6B45]/30 shadow-[2px_3px_0_rgba(42,42,42,0.12)] scale-105 rounded-[4px_10px_5px_8px]",
                    upcoming &&
                      "border-[#D4C9B8] bg-[#FAF7EF] text-[#9CA3AF] rounded-[3px_6px_4px_5px]"
                  )}
                >
                  {done ? (
                    <Check className="h-5 w-5" strokeWidth={2.5} />
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={cn(
                    "mt-2 text-[10px] sm:text-xs leading-tight max-w-[4.5rem] sm:max-w-none",
                    active && "font-semibold text-[#1a1a1a]",
                    done && "text-[#4A6B45]",
                    upcoming && "text-[#9CA3AF]"
                  )}
                >
                  {step.label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
