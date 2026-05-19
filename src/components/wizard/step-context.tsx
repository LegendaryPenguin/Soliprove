"use client";

import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { SourceLabel } from "@/components/shared/confidence-badge";
import { useSoilProve } from "@/context/soilprove-context";

const FieldMap = dynamic(
  () => import("@/components/map/field-map").then((m) => m.FieldMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-56 animate-pulse rounded-xl bg-[#E7E0D0]" />
    ),
  }
);

export function StepContext() {
  const { field } = useSoilProve();

  if (!field) {
    return (
      <p className="text-sm text-[#6B7280]">
        No field profile yet. Go back to set your field location, then continue.
      </p>
    );
  }

  const items = [
    {
      label: "Primary soil",
      value: field.soil?.mapUnitName,
      source: "USDA NRCS SSURGO",
      confidence: field.soil?.confidence,
    },
    {
      label: "Drainage",
      value: field.soil?.drainageClass,
      source: "USDA NRCS SSURGO",
      confidence: "high",
    },
    {
      label: "Slope",
      value: field.soil?.slope,
      source: "USDA NRCS SSURGO",
      confidence: "high",
    },
    {
      label: "Organic matter (est.)",
      value: field.soil?.organicMatterEstimate
        ? `${field.soil.organicMatterEstimate}%`
        : undefined,
      source: "USDA NRCS SSURGO",
      confidence: "medium",
    },
    {
      label: "County corn yield benchmark",
      value: field.cropBenchmark
        ? `${field.cropBenchmark.countyCornYieldBuAc} bu/ac`
        : undefined,
      source: "USDA NASS Quick Stats",
      confidence: "high",
    },
    {
      label: "Weather context",
      value:
        field.weather?.recentRainfallIn != null
          ? `${field.weather.recentRainfallIn}" recent · ${field.weather.forecastSummary}`
          : field.weather?.forecastSummary,
      source: "National Weather Service",
      confidence: "medium",
    },
    {
      label: "Nitrogen price default",
      value: field.fertilizerPrices
        ? `$${field.fertilizerPrices.nitrogenDefaultPerLb.toFixed(2)}/lb N`
        : undefined,
      source: field.fertilizerPrices?.source ?? "USDA AMS",
      confidence: "medium",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-[#E7E0D0] bg-[#FAF7EF] px-4 py-3">
        <p className="font-medium text-[#123524]">
          {field.county} County, {field.state} · {field.acres} acres
        </p>
        <p className="text-sm font-medium text-[#8B5E3C] mt-2 border-l-4 border-[#F2C94C] pl-3">
          Location gives context. Soil tests give precision.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <Card key={item.label} className="shadow-none border-[#E7E0D0]">
              <CardContent className="pt-4">
                <p className="text-xs text-[#6B7280] uppercase tracking-wide">
                  {item.label}
                </p>
                <p className="text-base font-semibold text-[#123524] mt-1">
                  {item.value ?? "—"}
                </p>
                <SourceLabel
                  source={item.source}
                  confidence={
                    item.confidence
                      ? String(item.confidence).charAt(0).toUpperCase() +
                        String(item.confidence).slice(1)
                      : undefined
                  }
                />
              </CardContent>
            </Card>
          ))}
        </div>
        <FieldMap
          lat={field.lat}
          lon={field.lon}
          boundary={field.boundary}
          className="h-56 sm:h-64 w-full rounded-xl border border-[#E7E0D0]"
        />
      </div>
    </div>
  );
}
