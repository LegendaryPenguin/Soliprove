"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from "react";
import type {
  AppState,
  FarmerInput,
  FieldProfile,
  PeerMatchResult,
  Recommendation,
  WizardStep,
} from "@/types";
import { buildRecommendation } from "@/lib/recommendation";
import { matchPeers } from "@/lib/peer/similarity";
import { fetchFieldProfile } from "@/lib/mock/field-profile";
import { STEP_ORDER, getStepIndex } from "@/lib/wizard/steps";

const STORAGE_KEY = "soilprove-state";

const defaultFarmerInput: FarmerInput = {
  rotation: "corn_after_soybean",
  cornPricePerBu: 4.25,
  nitrogenProduct: "anhydrous",
  nitrogenPricePerTon: 650,
  currentNRate: 180,
  currentP2O5Rate: 70,
  currentK2ORate: 80,
};

export type DraftLocation = {
  lat: number;
  lon: number;
  acres: number;
  zip?: string;
};

const DEFAULT_DRAFT: DraftLocation = {
  lat: 40.1164,
  lon: -88.2434,
  acres: 40,
  zip: "61820",
};

type SoilProveContextValue = Omit<AppState, "farmerInput"> & {
  farmerInput: FarmerInput;
  step: WizardStep;
  draftLocation: DraftLocation;
  setDraftLocation: (draft: Partial<DraftLocation>) => void;
  setStep: (step: WizardStep) => void;
  goBack: () => void;
  goNext: () => Promise<void>;
  canGoBack: () => boolean;
  canGoNext: () => boolean;
  continueLabel: () => string;
  isContinuing: boolean;
  demoFallbackActive: boolean;
  setFieldLocation: (lat: number, lon: number, acres: number) => Promise<void>;
  setFarmerInput: (input: Partial<FarmerInput>) => void;
  runRecommendation: () => void;
  profileChecklist: string[];
  resetWizard: () => void;
};

const SoilProveContext = createContext<SoilProveContextValue | null>(null);

export function SoilProveProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState<WizardStep>("field");
  const [field, setField] = useState<FieldProfile | undefined>();
  const [farmerInput, setFarmerInputState] = useState<FarmerInput>(defaultFarmerInput);
  const [recommendation, setRecommendation] = useState<Recommendation | undefined>();
  const [peerMatch, setPeerMatch] = useState<PeerMatchResult | undefined>();
  const [profileLoading, setProfileLoading] = useState(false);
  const [isContinuing, setIsContinuing] = useState(false);
  const [profileChecklist, setProfileChecklist] = useState<string[]>([]);
  const [draftLocation, setDraftLocationState] = useState<DraftLocation>(DEFAULT_DRAFT);
  const [demoFallbackActive, setDemoFallbackActive] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setHydrated(true);
        return;
      }
      const parsed = JSON.parse(raw);
      if (parsed.field) setField(parsed.field);
      if (parsed.farmerInput) setFarmerInputState(parsed.farmerInput);
      if (parsed.recommendation) setRecommendation(parsed.recommendation);
      if (parsed.peerMatch) setPeerMatch(parsed.peerMatch);
      if (parsed.step) setStep(parsed.step);
      if (parsed.draftLocation) setDraftLocationState(parsed.draftLocation);
      if (parsed.demoFallbackActive) setDemoFallbackActive(parsed.demoFallbackActive);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        field,
        farmerInput,
        recommendation,
        peerMatch,
        step,
        draftLocation,
        demoFallbackActive,
      })
    );
  }, [
    field,
    farmerInput,
    recommendation,
    peerMatch,
    step,
    draftLocation,
    demoFallbackActive,
    hydrated,
  ]);

  const setDraftLocation = useCallback((draft: Partial<DraftLocation>) => {
    setDraftLocationState((prev) => ({ ...prev, ...draft }));
  }, []);

  const setFieldLocation = useCallback(
    async (lat: number, lon: number, acres: number) => {
      setProfileLoading(true);
      const checks = [
        "County detected",
        "Soil map unit found",
        "Weather station matched",
        "Corn yield benchmark loaded",
        "Fertilizer price default loaded",
      ];
      setProfileChecklist([]);

      for (let i = 0; i < checks.length; i++) {
        await new Promise((r) => setTimeout(r, 350));
        setProfileChecklist((prev) => [...prev, checks[i]]);
      }

      const { profile, usedDemoFallback } = await fetchFieldProfile(lat, lon, acres);
      setField(profile);
      setDemoFallbackActive(usedDemoFallback);
      setDraftLocationState({ lat, lon, acres });
      setProfileLoading(false);
    },
    []
  );

  const setFarmerInput = useCallback((partial: Partial<FarmerInput>) => {
    setFarmerInputState((prev) => ({ ...prev, ...partial }));
  }, []);

  const runRecommendation = useCallback(() => {
    if (!field) return;
    const rec = buildRecommendation(field, farmerInput);
    const peers = matchPeers(field, farmerInput);
    setRecommendation(rec);
    setPeerMatch(peers);
  }, [field, farmerInput]);

  const canGoBack = useCallback(() => getStepIndex(step) > 0, [step]);

  const canGoNext = useCallback(() => {
    switch (step) {
      case "field":
        return draftLocation.acres > 0;
      case "context":
        return Boolean(field);
      case "input":
        return Boolean(field);
      case "results":
        return Boolean(recommendation);
      case "peers":
        return Boolean(peerMatch);
      case "export":
        return Boolean(recommendation && field);
      default:
        return false;
    }
  }, [step, draftLocation, field, recommendation, peerMatch]);

  const continueLabel = useCallback(() => {
    switch (step) {
      case "field":
        return "Continue";
      case "input":
        return "Generate prescription";
      case "peers":
        return "Continue to export";
      case "export":
        return "Finish";
      default:
        return "Continue";
    }
  }, [step]);

  const goBack = useCallback(() => {
    const idx = getStepIndex(step);
    if (idx > 0) setStep(STEP_ORDER[idx - 1]);
  }, [step]);

  const goNext = useCallback(async () => {
    if (!canGoNext()) return;
    setIsContinuing(true);
    try {
      switch (step) {
        case "field": {
          const { lat, lon, acres } = draftLocation;
          const unchanged =
            field &&
            Math.abs(field.lat - lat) < 0.0001 &&
            Math.abs(field.lon - lon) < 0.0001 &&
            field.acres === acres;
          if (!unchanged) {
            await setFieldLocation(lat, lon, acres);
          }
          setStep("context");
          break;
        }
        case "context":
          setStep("input");
          break;
        case "input":
          runRecommendation();
          setStep("results");
          break;
        case "results":
          setStep("peers");
          break;
        case "peers":
          setStep("export");
          break;
        default:
          break;
      }
    } finally {
      setIsContinuing(false);
    }
  }, [step, draftLocation, field, setFieldLocation, runRecommendation, canGoNext]);

  const resetWizard = useCallback(() => {
    setStep("field");
    setField(undefined);
    setFarmerInputState(defaultFarmerInput);
    setRecommendation(undefined);
    setPeerMatch(undefined);
    setDraftLocationState(DEFAULT_DRAFT);
    setDemoFallbackActive(false);
    setProfileChecklist([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <SoilProveContext.Provider
      value={{
        field,
        farmerInput,
        recommendation,
        peerMatch,
        profileLoading,
        step,
        draftLocation,
        setDraftLocation,
        setStep,
        goBack,
        goNext,
        canGoBack,
        canGoNext,
        continueLabel,
        isContinuing,
        demoFallbackActive,
        setFieldLocation,
        setFarmerInput,
        runRecommendation,
        profileChecklist,
        resetWizard,
      }}
    >
      {children}
    </SoilProveContext.Provider>
  );
}

export function useSoilProve() {
  const ctx = useContext(SoilProveContext);
  if (!ctx) throw new Error("useSoilProve must be used within SoilProveProvider");
  return ctx;
}
