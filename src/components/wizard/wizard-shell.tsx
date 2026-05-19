"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WizardProgress } from "@/components/wizard/wizard-progress";
import { FieldSummarySidebar } from "@/components/wizard/field-summary-sidebar";
import { getStepConfig } from "@/lib/wizard/steps";
import { useSoilProve } from "@/context/soilprove-context";

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
  } = useSoilProve();

  const config = getStepConfig(step);
  const showLoadingPanel = step === "field" && profileLoading;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#FAF7EF]">
      <div className="mx-auto max-w-6xl px-4 py-6 lg:py-10 space-y-6">
        <div className="space-y-1">
          <Link
            href="/"
            className="text-xs text-[#6B7280] hover:text-[#1F6F43] inline-flex items-center gap-1"
          >
            ← Back to home
          </Link>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#123524] font-display">
            Build your prescription
          </h1>
          <p className="text-[#6B7280] text-sm lg:text-base max-w-2xl">
            Six guided steps from field location to exportable fertilizer plan.
          </p>
        </div>

        <Card className="border-[#E7E0D0] bg-white shadow-sm p-4 sm:p-6">
          <WizardProgress current={step} />
        </Card>

        {demoFallbackActive && step !== "field" && (
          <div className="flex items-start gap-2 rounded-lg border border-[#F2C94C]/60 bg-[#F2C94C]/15 px-4 py-3 text-sm text-[#123524]">
            <AlertCircle className="h-4 w-4 shrink-0 text-[#8B5E3C] mt-0.5" />
            <p>
              Using demo fallback data for one or more data sources. The wizard
              will continue with realistic regional defaults.
            </p>
          </div>
        )}

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-[#123524]">{config.title}</h2>
          <p className="text-[#6B7280]">{config.description}</p>
          <p className="text-sm text-[#8B5E3C] border-l-4 border-[#F2C94C] pl-3 py-0.5">
            {config.helper}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_280px] items-start">
          <Card className="card-elevated border-[#E7E0D0] overflow-hidden">
            <CardContent className="p-5 sm:p-8">
              {showLoadingPanel && (
                <div className="mb-6 rounded-lg bg-[#FAF7EF] border border-[#E7E0D0] p-4 text-sm">
                  <p className="font-medium text-[#123524] mb-2 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-[#1F6F43]" />
                    Building field profile...
                  </p>
                  <ul className="space-y-1">
                    {profileChecklist.map((c) => (
                      <li key={c} className="text-[#1F6F43]">
                        ✓ {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {children}
            </CardContent>

            <div className="flex items-center justify-between gap-4 border-t border-[#E7E0D0] bg-[#FAF7EF]/50 px-5 sm:px-8 py-4">
              <Button
                type="button"
                variant="secondary"
                onClick={goBack}
                disabled={!canGoBack() || profileLoading}
                className="min-w-[100px]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>

              {step === "export" ? (
                <Button asChild variant="accent" className="min-w-[140px]">
                  <Link href="/">
                    Finish
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => void goNext()}
                  disabled={!canGoNext() || profileLoading || isContinuing}
                  className="min-w-[140px]"
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
                </Button>
              )}
            </div>
          </Card>

          <FieldSummarySidebar />
        </div>
      </div>
    </div>
  );
}
