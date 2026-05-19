"use client";

import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  buildReportText,
  recommendationToCsv,
  recommendationToGeoJSON,
} from "@/lib/export/formats";
import { useSoilProve } from "@/context/soilprove-context";

function downloadBlob(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function StepExport() {
  const { field, farmerInput, recommendation, peerMatch } = useSoilProve();

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Export prescription</CardTitle>
          <p className="text-sm text-[#6B7280]">
            Download operational files for your applicator or farm records.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => downloadBlob(csv, "soilprove-zones.csv", "text/csv")}
          >
            <Download className="h-4 w-4" /> Download CSV
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() =>
              downloadBlob(geojson, "soilprove-zones.geojson", "application/json")
            }
          >
            <Download className="h-4 w-4" /> Download GeoJSON
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() =>
              downloadBlob(report, "soilprove-report.txt", "text/plain")
            }
          >
            <FileText className="h-4 w-4" /> Download grower report (text)
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Equipment integrations</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          {[
            "John Deere Operations Center",
            "Ag Leader",
            "Trimble",
            "Raven",
            "ISOXML",
          ].map((name) => (
            <Button key={name} variant="secondary" disabled className="justify-start">
              {name} — Coming soon
            </Button>
          ))}
        </CardContent>
      </Card>

      <p className="text-xs text-[#6B7280] border-l-4 border-[#8B5E3C] pl-3">
        SoilProve is a decision-support tool. Final fertilizer decisions should be
        reviewed with a certified crop adviser or local extension recommendation,
        especially when no current soil test is available.
      </p>

    </div>
  );
}
