"use client";

import { MapPin, Sprout } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { useSoilProve } from "@/context/soilprove-context";
import { getStepIndex } from "@/lib/wizard/steps";

export function FieldSummarySidebar() {
  const { field, farmerInput, recommendation, step, draftLocation } =
    useSoilProve();
  const stepIndex = getStepIndex(step);

  if (!field && step === "field") {
    return (
      <Card className="border-[#E7E0D0] bg-[#FAF7EF]/80 shadow-sm h-fit lg:sticky lg:top-24">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#8B5E3C]" />
            Your field
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-[#6B7280] space-y-2">
          <p>Pin: {draftLocation.lat.toFixed(4)}, {draftLocation.lon.toFixed(4)}</p>
          <p>{draftLocation.acres} acres (draft)</p>
          <p className="text-xs pt-2 border-t border-[#E7E0D0]">
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
    <Card className="border-[#E7E0D0] bg-white shadow-sm h-fit lg:sticky lg:top-24">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Sprout className="h-4 w-4 text-[#1F6F43]" />
          Field summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <p className="text-xs text-[#6B7280] uppercase tracking-wide">Location</p>
          <p className="font-medium text-[#123524]">
            {field.county} County, {field.state}
          </p>
          <p className="text-[#6B7280]">{field.acres} acres</p>
        </div>

        {field.soil?.mapUnitName && (
          <div>
            <p className="text-xs text-[#6B7280] uppercase tracking-wide">Soil</p>
            <p className="text-[#123524] leading-snug">{field.soil.mapUnitName}</p>
          </div>
        )}

        {field.cropBenchmark && (
          <div>
            <p className="text-xs text-[#6B7280] uppercase tracking-wide">
              County corn yield
            </p>
            <p className="text-[#123524]">
              {field.cropBenchmark.countyCornYieldBuAc} bu/ac
            </p>
          </div>
        )}

        {stepIndex >= 2 && (
          <div>
            <p className="text-xs text-[#6B7280] uppercase tracking-wide">Rotation</p>
            <p className="text-[#123524] capitalize">
              {farmerInput.rotation.replace(/_/g, " ")}
            </p>
          </div>
        )}

        {recommendation && (
          <div className="pt-2 border-t border-[#E7E0D0]">
            <p className="text-xs text-[#6B7280] uppercase tracking-wide">
              Prescription
            </p>
            <p className="text-[#123524]">
              N {recommendation.nRate} · P {recommendation.p2o5Rate} · K{" "}
              {recommendation.k2oRate}
            </p>
            <p className="text-[#1F6F43] font-semibold mt-1">
              {formatCurrency(recommendation.savingsPerAcre)}/ac saved
            </p>
          </div>
        )}

        <div className="pt-2 border-t border-[#E7E0D0]">
          <p className="text-xs text-[#6B7280] uppercase tracking-wide mb-1">
            Collected so far
          </p>
          <ul className="space-y-0.5">
            {collected.map((item) => (
              <li key={item} className="text-[#1F6F43] text-xs flex items-center gap-1">
                <span>✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
