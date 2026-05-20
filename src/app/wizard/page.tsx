"use client";

import { AnimatePresence, motion } from "framer-motion";
import { SoilProveProvider, useSoilProve } from "@/context/soilprove-context";
import { WizardShell } from "@/components/wizard/wizard-shell";
import { WizardCoach } from "@/components/wizard/wizard-coach";
import { StepField } from "@/components/wizard/step-field";
import { StepContext } from "@/components/wizard/step-context";
import { StepInput } from "@/components/wizard/step-input";
import { StepResults } from "@/components/wizard/step-results";
import { StepPeers } from "@/components/wizard/step-peers";
import { StepExport } from "@/components/wizard/step-export";

const stepVariants = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

function WizardSteps() {
  const { step } = useSoilProve();

  const content = (() => {
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
  })();

  return (
    <div className="space-y-4">
      <WizardCoach step={step} />
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={stepVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          {content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function WizardPage() {
  return (
    <SoilProveProvider>
      <div className="wizard-page">
        <WizardShell>
          <WizardSteps />
        </WizardShell>
      </div>
    </SoilProveProvider>
  );
}
