"use client";

import { useState } from "react";
import { BookOpen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GUIDES: Record<
  string,
  { title: string; steps: string[]; fileHint: string }
> = {
  "Ag Leader": {
    title: "Ag Leader — import SoilProve export",
    steps: [
      "Download GeoJSON or CSV from SoilProve export step.",
      "In Ag Leader SMS, open Field → Import → User Polygons or Variable Rate.",
      "Map columns: zone, n_rate, p2o5_rate, k2o_rate.",
      "Verify acres per zone before applying.",
    ],
    fileHint: "Prefer GeoJSON for polygon zones; CSV for flat rate tables.",
  },
  Trimble: {
    title: "Trimble — Farm Works / WM-Form",
    steps: [
      "Export GeoJSON from SoilProve.",
      "In Farm Works, use Boundary Import for field outline.",
      "Create prescription layers from zone attributes (n_rate, etc.).",
      "Send to display or controller via WM-Form.",
    ],
    fileHint: "GeoJSON properties match SoilProve zone table.",
  },
  Raven: {
    title: "Raven — Slingshot / field computer",
    steps: [
      "Download CSV zone export.",
      "Import as application layer in Slingshot desktop.",
      "Assign products to N/P/K columns per zone.",
      "Review totals against SoilProve summary before application.",
    ],
    fileHint: "Use CSV for controller-friendly flat files.",
  },
  ISOXML: {
    title: "ISOXML — standard precision ag format",
    steps: [
      "SoilProve exports GeoJSON; use a converter (e.g. GDAL) to ISOXML TaskData if required.",
      "Place TaskData.xml in controller USB folder per manufacturer manual.",
      "Load task on terminal and verify zone boundaries on map.",
    ],
    fileHint: "ISOXML generation may require third-party conversion for hackathon demo.",
  },
};

export function OemGuideButtons() {
  const [open, setOpen] = useState<string | null>(null);
  const guide = open ? GUIDES[open] : null;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Other equipment</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          {Object.keys(GUIDES).map((name) => (
            <Button
              key={name}
              type="button"
              variant="outline"
              className="justify-start"
              onClick={() => setOpen(name)}
            >
              <BookOpen className="h-4 w-4" />
              {name} — Import guide
            </Button>
          ))}
        </CardContent>
      </Card>

      {guide && open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40">
          <Card className="max-w-md w-full shadow-xl">
            <CardHeader className="flex flex-row items-start justify-between">
              <CardTitle className="text-lg pr-8">{guide.title}</CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setOpen(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              <ol className="list-decimal pl-5 text-sm text-[#6B7280] space-y-2">
                {guide.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
              <p className="text-xs text-[#8B5E3C] border-l-4 border-[#F2C94C] pl-3">
                {guide.fileHint}
              </p>
              <Button className="w-full" onClick={() => setOpen(null)}>
                Got it
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
