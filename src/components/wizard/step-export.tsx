"use client";

import { useState } from "react";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeereConnect } from "@/components/export/deere-connect";
import { OemGuideButtons } from "@/components/export/oem-guide-modal";
import {
  buildReportText,
  recommendationToCsv,
  recommendationToGeoJSON,
} from "@/lib/export/formats";
import { generatePdfReport } from "@/lib/export/pdf-report";
import { useSoilProve } from "@/context/soilprove-context";

function downloadBlob(content: string | Blob, filename: string, mime: string) {
  const blob =
    content instanceof Blob ? content : new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function StepExport() {
  const { field, farmerInput, recommendation, peerMatch } = useSoilProve();
  const [toast, setToast] = useState<string | null>(null);

  if (!field || !farmerInput || !recommendation) {
    return (
      <p className="text-sm text-[#6B7280]">
        Complete the prescription step before exporting your files.
      </p>
    );
  }

  const csv = recommendationToCsv(recommendation);
  const geojson = JSON.stringify(
    recommendationToGeoJSON(recommendation, field),
    null,
    2
  );
  const report = buildReportText(field, farmerInput, recommendation, peerMatch);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="rounded-lg bg-[#1F6F43] text-white text-sm px-4 py-2 animate-step-in">
          {toast}
        </div>
      )}

      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Download files</CardTitle>
          <p className="text-sm text-[#6B7280]">
            Operational exports for records, applicators, and equipment workflows.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => {
              downloadBlob(csv, "soilprove-zones.csv", "text/csv");
              showToast("CSV downloaded");
            }}
          >
            <Download className="h-4 w-4" /> Download CSV
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => {
              downloadBlob(geojson, "soilprove-zones.geojson", "application/json");
              showToast("GeoJSON downloaded");
            }}
          >
            <Download className="h-4 w-4" /> Download GeoJSON
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => {
              downloadBlob(report, "soilprove-report.txt", "text/plain");
              showToast("Text report downloaded");
            }}
          >
            <FileText className="h-4 w-4" /> Download text report
          </Button>
          <Button
            variant="default"
            className="justify-start"
            onClick={() => {
              const pdf = generatePdfReport(
                field,
                farmerInput,
                recommendation,
                peerMatch
              );
              downloadBlob(pdf, "soilprove-report.pdf", "application/pdf");
              showToast("PDF report downloaded");
            }}
          >
            <Download className="h-4 w-4" /> Download PDF grower report
          </Button>
        </CardContent>
      </Card>

      <DeereConnect field={field} recommendation={recommendation} />

      <OemGuideButtons />

      <p className="text-xs text-[#6B7280] border-l-4 border-[#8B5E3C] pl-3">
        SoilProve is a decision-support tool. Final fertilizer decisions should be
        reviewed with a certified crop adviser or local extension recommendation,
        especially when no current soil test is available.
      </p>
    </div>
  );
}
