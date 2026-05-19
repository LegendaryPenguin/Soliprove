import type { WizardStep } from "@/types";

export type WizardStepConfig = {
  id: WizardStep;
  number: number;
  label: string;
  title: string;
  description: string;
  helper: string;
};

export const WIZARD_STEPS: WizardStepConfig[] = [
  {
    id: "field",
    number: 1,
    label: "Field Location",
    title: "Field location",
    description: "Place your field on the map so we can pull public agronomic context.",
    helper:
      "Drop a pin or use your location so SoilProve can build a field profile.",
  },
  {
    id: "context",
    number: 2,
    label: "Field Context",
    title: "Field context",
    description: "Review the soil, crop, weather, and price data we found for this field.",
    helper:
      "We pulled public soil, crop, and weather data for this location.",
  },
  {
    id: "input",
    number: 3,
    label: "Farm Inputs",
    title: "Farm inputs",
    description: "Confirm rotation, economics, and current fertilizer rates.",
    helper:
      "Confirm only the details we cannot reliably get from public data.",
  },
  {
    id: "results",
    number: 4,
    label: "Prescription",
    title: "Your prescription",
    description: "Recommended N, P, and K rates with savings and confidence.",
    helper:
      "Here is the recommended fertilizer plan and estimated savings.",
  },
  {
    id: "peers",
    number: 5,
    label: "Peer Proof",
    title: "Peer proof",
    description: "See how similar nearby fields performed with comparable reductions.",
    helper:
      "See how similar nearby fields performed with comparable reductions.",
  },
  {
    id: "export",
    number: 6,
    label: "Export",
    title: "Export prescription",
    description: "Download files for records, review, or equipment workflows.",
    helper:
      "Download the prescription for review or field equipment workflows.",
  },
];

export const STEP_ORDER = WIZARD_STEPS.map((s) => s.id);

export const TOTAL_STEPS = WIZARD_STEPS.length;

export function getStepConfig(step: WizardStep): WizardStepConfig {
  return WIZARD_STEPS.find((s) => s.id === step) ?? WIZARD_STEPS[0];
}

export function getStepIndex(step: WizardStep): number {
  return STEP_ORDER.indexOf(step);
}
