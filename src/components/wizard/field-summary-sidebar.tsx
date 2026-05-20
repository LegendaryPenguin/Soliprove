"use client";

import { MapPin, Sprout } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StockImage } from "@/components/shared/stock-image";
import { formatCurrency } from "@/lib/utils";
import { STOCK } from "@/lib/images/stock-photos";
import { useSoilProve } from "@/context/soilprove-context";
import { getStepIndex } from "@/lib/wizard/steps";

export function FieldSummarySidebar() {
  const { field, farmerInput, recommendation, step, draftLocation } =
    useSoilProve();
  const stepIndex = getStepIndex(step);

  const thumbSrc = field ? STOCK.cornField : STOCK.fieldHills;

  if (!field && step === "field") {
    return (
      <Card className="wizard-card h-fit border-[#2a2a2a]/15 bg-white/95 shadow-[3px_4px_0_rgba(42,42,42,0.08)] lg:sticky lg:top-24">
        <StockImage
          src={thumbSrc}
          alt="Midwest corn field"
          className="h-32 w-full border-b-2 border-[#E7E0D0]"
          sizes="300px"
        />
        <CardHeader className="pb-2">
          <CardTitle className="landing-display flex items-center gap-2 text-xl text-[#1a1a1a]">
            <MapPin className="h-4 w-4 text-[#6B4E3D]" />
            Your field
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-[#555]">
          <p>
            Pin: {draftLocation.lat.toFixed(4)}, {draftLocation.lon.toFixed(4)}
          </p>
          <p>{draftLocation.acres} acres (draft)</p>
          <p className="border-t border-[#E7E0D0] pt-2 text-xs">
            Data collected: location draft
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!field) return null;

  const collected: string[] = ["Field location"];
  if (stepIndex >= 1) collected.push("Soil & context");
  if (stepIndex >= 2) collected.push("Farm inputs");
  if (stepIndex >= 3) collected.push("Prescription");
  if (stepIndex >= 4) collected.push("Peer proof");

  return (
    <Card className="wizard-card h-fit border-[#2a2a2a]/15 bg-white/95 shadow-[3px_4px_0_rgba(42,42,42,0.08)] lg:sticky lg:top-24">
      <StockImage
        src={thumbSrc}
        alt={`Field in ${field.county} County, ${field.state}`}
        className="h-36 w-full border-b-2 border-[#E7E0D0]"
        sizes="300px"
      />
      <CardHeader className="pb-2">
        <CardTitle className="landing-display flex items-center gap-2 text-xl text-[#1a1a1a]">
          <Sprout className="h-4 w-4 text-[#4A6B45]" />
          Field summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <p className="text-xs uppercase tracking-wide text-[#6B4E3D]">
            Location
          </p>
          <p className="font-semibold text-[#1a1a1a]">
            {field.county} County, {field.state}
          </p>
          <p className="text-[#555]">{field.acres} acres</p>
        </div>

        {field.soil?.mapUnitName && (
          <div>
            <p className="text-xs uppercase tracking-wide text-[#6B4E3D]">
              Soil
            </p>
            <p className="leading-snug text-[#1a1a1a]">{field.soil.mapUnitName}</p>
          </div>
        )}

        {field.cropBenchmark && (
          <div>
            <p className="text-xs uppercase tracking-wide text-[#6B4E3D]">
              County corn yield
            </p>
            <p className="text-[#1a1a1a]">
              {field.cropBenchmark.countyCornYieldBuAc} bu/ac
            </p>
          </div>
        )}

        {stepIndex >= 2 && (
          <div>
            <p className="text-xs uppercase tracking-wide text-[#6B4E3D]">
              Rotation
            </p>
            <p className="capitalize text-[#1a1a1a]">
              {farmerInput.rotation.replace(/_/g, " ")}
            </p>
          </div>
        )}

        {recommendation && (
          <div className="border-t border-[#E7E0D0] pt-2">
            <p className="text-xs uppercase tracking-wide text-[#6B4E3D]">
              Prescription
            </p>
            <p className="text-[#1a1a1a]">
              N {recommendation.nRate} · P {recommendation.p2o5Rate} · K{" "}
              {recommendation.k2oRate}
            </p>
            <p className="mt-1 font-semibold text-[#4A6B45]">
              {formatCurrency(recommendation.savingsPerAcre)}/ac saved
            </p>
          </div>
        )}

        <div className="border-t border-[#E7E0D0] pt-2">
          <p className="mb-1 text-xs uppercase tracking-wide text-[#6B4E3D]">
            Collected so far
          </p>
          <ul className="space-y-0.5">
            {collected.map((item) => (
              <li
                key={item}
                className="flex items-center gap-1 text-xs text-[#4A6B45]"
              >
                <span>+</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
