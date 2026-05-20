"use client";

import { AlertCircle, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { WizardProgress } from "@/components/wizard/wizard-progress";
import { FieldSummarySidebar } from "@/components/wizard/field-summary-sidebar";
import { getStepConfig } from "@/lib/wizard/steps";
import { useSoilProve } from "@/context/soilprove-context";
import { SketchButton } from "@/components/landing/sketch-button";
import { WizardPageHeader } from "@/components/wizard/wizard-chrome";

export function WizardShell({ children }: { children: React.ReactNode }) {
  const {
    step,
    goBack,
    goNext,
    canGoBack,
    canGoNext,
    continueLabel,
    isContinuing,
    demoFallbackActive,
    profileChecklist,
    profileLoading,
    resetWizard,
  } = useSoilProve();

  const config = getStepConfig(step);
  const showLoadingPanel = step === "field" && profileLoading;

  return (
    <div className="landing-paper min-h-screen">
      <div
        className="h-2 w-full bg-[#3D5C3A]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #3D5C3A 0, #3D5C3A 12px, #4A6B45 12px, #4A6B45 24px)",
        }}
        aria-hidden
      />

      <div className="mx-auto max-w-6xl px-4 py-6 lg:py-10 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <WizardPageHeader
            title="Build your prescription"
            subtitle="Six guided steps from field location to exportable fertilizer plan."
          />
          <SketchButton
            type="button"
            variant="brown"
            className="text-xs shrink-0"
            onClick={() => {
              if (
                window.confirm("Reset the wizard and clear saved progress?")
              )
                resetWizard();
            }}
          >
            Reset wizard
          </SketchButton>
        </div>

        <Card className="wizard-card border-[#2a2a2a]/15 bg-white/95 p-4 sm:p-6 shadow-[3px_4px_0_rgba(42,42,42,0.08)]">
          <WizardProgress current={step} />
        </Card>

        {demoFallbackActive && step !== "field" && (
          <div className="flex items-start gap-2 rounded-sm border-2 border-[#F2C94C]/70 bg-[#F2C94C]/20 px-4 py-3 text-sm text-[#1a1a1a]">
            <AlertCircle className="h-4 w-4 shrink-0 text-[#8B5E3C] mt-0.5" />
            <p>
              Using demo fallback data for one or more data sources. The wizard
              will continue with realistic regional defaults.
            </p>
          </div>
        )}

        <div className="space-y-2 border-l-4 border-[#4A6B45] pl-4">
          <h2 className="landing-display text-2xl text-[#1a1a1a]">
            {config.title}
          </h2>
          <p className="text-sm text-[#555]">{config.description}</p>
          <p className="text-sm text-[#6B4E3D]">{config.helper}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px] items-start">
          <Card className="wizard-card overflow-hidden border-[#2a2a2a]/20 bg-white/95 shadow-[4px_5px_0_rgba(42,42,42,0.1)]">
            <CardContent className="p-5 sm:p-8">
              {showLoadingPanel && (
                <div className="mb-6 rounded-sm border-2 border-[#E7E0D0] bg-[#FAF7EF] p-4 text-sm">
                  <p className="font-medium text-[#3D5C3A] mb-2 flex items-center gap-2 landing-display text-lg">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Building field profile...
                  </p>
                  <ul className="space-y-1 text-[#4A6B45]">
                    {profileChecklist.map((c) => (
                      <li key={c}>- {c}</li>
                    ))}
                  </ul>
                </div>
              )}
              {children}
            </CardContent>

            <div className="flex items-center justify-between gap-4 border-t-2 border-[#E7E0D0] bg-[#F4EFE4]/80 px-5 sm:px-8 py-4">
              <SketchButton
                type="button"
                variant="brown"
                onClick={goBack}
                disabled={!canGoBack() || profileLoading}
                className="min-w-[100px] opacity-90 disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </SketchButton>

              {step === "export" ? (
                <SketchButton href="/" variant="green" className="min-w-[140px]">
                  Finish
                  <ArrowRight className="h-4 w-4" />
                </SketchButton>
              ) : (
                <SketchButton
                  type="button"
                  variant="green"
                  onClick={() => void goNext()}
                  disabled={!canGoNext() || profileLoading || isContinuing}
                  className="min-w-[140px] disabled:opacity-50"
                >
                  {profileLoading || isContinuing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Please wait...
                    </>
                  ) : (
                    <>
                      {continueLabel()}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </SketchButton>
              )}
            </div>
          </Card>

          <FieldSummarySidebar />
        </div>
      </div>

      <div
        className="mt-10 h-8 w-full bg-[length:100%_100%] bg-bottom bg-no-repeat"
        style={{ backgroundImage: "url(/landing/fence-bottom.svg)" }}
        aria-hidden
      />
    </div>
  );
}

