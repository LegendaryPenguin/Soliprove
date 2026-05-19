import { Badge } from "@/components/ui/badge";
import type { ConfidenceLevel } from "@/types";

export function ConfidenceBadge({ level }: { level: ConfidenceLevel }) {
  return (
    <Badge variant={level === "high" ? "high" : level === "medium" ? "medium" : "low"}>
      {level.charAt(0).toUpperCase() + level.slice(1)} confidence
    </Badge>
  );
}

export function SourceLabel({ source, confidence }: { source: string; confidence?: string }) {
  return (
    <p className="text-xs text-[#6B7280] mt-1">
      Source: {source}
      {confidence ? ` · Confidence: ${confidence}` : ""}
    </p>
  );
}
