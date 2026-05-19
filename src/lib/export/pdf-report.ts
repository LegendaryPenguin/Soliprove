import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { FarmerInput, FieldProfile, PeerMatchResult, Recommendation } from "@/types";

export function generatePdfReport(
  field: FieldProfile,
  input: FarmerInput,
  rec: Recommendation,
  peers?: PeerMatchResult
): Blob {
  const doc = new jsPDF();
  const margin = 14;
  let y = 20;

  doc.setFontSize(18);
  doc.setTextColor(31, 111, 67);
  doc.text("SoilProve — Field Prescription Report", margin, y);
  y += 12;

  doc.setFontSize(10);
  doc.setTextColor(18, 53, 36);
  doc.text(`${field.county} County, ${field.state} · ${field.acres} acres`, margin, y);
  y += 8;
  doc.text(`Soil: ${field.soil?.mapUnitName ?? "—"}`, margin, y);
  y += 12;

  doc.setFontSize(12);
  doc.text("Recommended plan", margin, y);
  y += 8;
  doc.setFontSize(10);
  doc.text(`Nitrogen: ${rec.nRate} lb N/ac`, margin, y);
  y += 6;
  doc.text(`P₂O₅: ${rec.p2o5Rate} lb/ac · K₂O: ${rec.k2oRate} lb/ac`, margin, y);
  y += 6;
  doc.text(`Savings: $${rec.savingsPerAcre.toFixed(2)}/ac · Total: $${rec.totalSavings.toFixed(2)}`, margin, y);
  y += 6;
  doc.text(`Confidence: ${rec.confidenceScore}% (${rec.confidenceLabel})`, margin, y);
  y += 10;

  autoTable(doc, {
    startY: y,
    head: [["Zone", "Acres", "N", "P₂O₅", "K₂O", "Confidence"]],
    body: rec.zones.map((z) => [
      z.zone,
      String(z.acres),
      String(z.nRate),
      String(z.p2o5Rate),
      String(z.k2oRate),
      z.confidence,
    ]),
    margin: { left: margin },
    headStyles: { fillColor: [31, 111, 67] },
  });

  y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  if (peers) {
    doc.text(
      `Peer validation: ${peers.count} similar fields, avg N reduction ${peers.averageNReduction} lb/ac`,
      margin,
      y
    );
    y += 10;
  }

  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text(
    "SoilProve is a decision-support tool. Review with a certified crop adviser before applying.",
    margin,
    280
  );

  return doc.output("blob");
}
