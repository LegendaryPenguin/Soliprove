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
        <p className="text-sm font-semibold text-[#1F6F43]">
          Step {currentIndex + 1} of {TOTAL_STEPS}
        </p>
        <p className="text-sm text-[#6B7280] hidden sm:block">
          {WIZARD_STEPS[currentIndex]?.label}
        </p>
      </div>

      <div className="relative">
        <div
          className="absolute top-5 left-0 right-0 h-0.5 bg-[#E7E0D0] hidden sm:block"
          aria-hidden
        />
        <div
          className="absolute top-5 left-0 h-0.5 bg-[#1F6F43] hidden sm:block transition-all duration-300"
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
                    "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all",
                    done &&
                      "border-[#1F6F43] bg-[#1F6F43] text-white shadow-sm",
                    active &&
                      "border-[#1F6F43] bg-white text-[#1F6F43] ring-4 ring-[#1F6F43]/15 shadow-md scale-105",
                    upcoming &&
                      "border-[#E7E0D0] bg-[#FAF7EF] text-[#9CA3AF]"
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
                    active && "font-semibold text-[#123524]",
                    done && "text-[#1F6F43]",
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
