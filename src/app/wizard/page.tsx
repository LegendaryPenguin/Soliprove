"use client";

import { SoilProveProvider, useSoilProve } from "@/context/soilprove-context";
import { WizardShell } from "@/components/wizard/wizard-shell";
import { StepField } from "@/components/wizard/step-field";
import { StepContext } from "@/components/wizard/step-context";
import { StepInput } from "@/components/wizard/step-input";
import { StepResults } from "@/components/wizard/step-results";
import { StepPeers } from "@/components/wizard/step-peers";
import { StepExport } from "@/components/wizard/step-export";

function WizardSteps() {
  const { step } = useSoilProve();

  switch (step) {
    case "field":
      return <StepField />;
    case "context":
      return <StepContext />;
    case "input":
      return <StepInput />;
    case "results":
      return <StepResults />;
    case "peers":
      return <StepPeers />;
    case "export":
      return <StepExport />;
    default:
      return <StepField />;
  }
}

export default function WizardPage() {
  return (
    <SoilProveProvider>
      <WizardShell>
        <WizardSteps />
      </WizardShell>
    </SoilProveProvider>
  );
}
