import peerFields from "@/data/peer-fields.json";
import type { FarmerInput, FieldProfile, PeerField, PeerMatchResult } from "@/types";

function distanceScore(miles: number): number {
  if (miles <= 15) return 1;
  if (miles <= 30) return 0.85;
  if (miles <= 45) return 0.65;
  return 0.4;
}

function soilTypeScore(field?: FieldProfile, peer?: PeerField): number {
  const fieldTexture = field?.soil?.texture?.toLowerCase() ?? "";
  const peerTexture = peer?.soilTexture.toLowerCase() ?? "";
  if (!fieldTexture || !peerTexture) return 0.5;
  if (fieldTexture === peerTexture) return 1;
  if (fieldTexture.includes("clay") && peerTexture.includes("clay")) return 0.8;
  if (fieldTexture.includes("loam") && peerTexture.includes("loam")) return 0.75;
  return 0.45;
}

function rotationScore(
  farmer?: FarmerInput,
  peer?: PeerField
): number {
  if (!farmer || !peer) return 0.5;
  return farmer.rotation === peer.rotation ? 1 : 0.35;
}

function yieldGoalScore(field?: FieldProfile, peer?: PeerField): number {
  const benchmark = field?.cropBenchmark?.countyCornYieldBuAc ?? 200;
  const diff = Math.abs(benchmark - (peer?.yieldBenchmarkBuAc ?? benchmark));
  if (diff <= 5) return 1;
  if (diff <= 15) return 0.75;
  if (diff <= 25) return 0.5;
  return 0.3;
}

function organicMatterScore(field?: FieldProfile, peer?: PeerField): number {
  const om =
    field?.soil?.organicMatterEstimate ?? peer?.organicMatterPct ?? 3.5;
  const diff = Math.abs(om - (peer?.organicMatterPct ?? om));
  if (diff <= 0.3) return 1;
  if (diff <= 0.8) return 0.7;
  return 0.4;
}

function drainageScore(field?: FieldProfile, peer?: PeerField): number {
  const fd = field?.soil?.drainageClass?.toLowerCase() ?? "";
  const pd = peer?.drainageClass.toLowerCase() ?? "";
  if (!fd || !pd) return 0.5;
  if (fd === pd) return 1;
  if (fd.includes("poor") && pd.includes("poor")) return 0.8;
  return 0.45;
}

export function peerSimilarity(
  field: FieldProfile,
  farmer: FarmerInput,
  peer: PeerField
): number {
  return (
    distanceScore(peer.distanceMiles) * 0.2 +
    soilTypeScore(field, peer) * 0.25 +
    rotationScore(farmer, peer) * 0.2 +
    yieldGoalScore(field, peer) * 0.15 +
    organicMatterScore(field, peer) * 0.1 +
    drainageScore(field, peer) * 0.1
  );
}

export function matchPeers(
  field: FieldProfile,
  farmer: FarmerInput,
  limit = 12
): PeerMatchResult {
  const scored = (peerFields as PeerField[])
    .map((peer) => ({
      ...peer,
      similarityScore: peerSimilarity(field, farmer, peer),
    }))
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit);

  const count = scored.length;
  const averageNReduction =
    Math.round(
      (scored.reduce((s, p) => s + p.nReductionLbAc, 0) / count) * 10
    ) / 10;
  const averageYieldChange =
    Math.round(
      (scored.reduce((s, p) => s + p.yieldChangeBuAc, 0) / count) * 10
    ) / 10;
  const averageSavings =
    Math.round(
      (scored.reduce((s, p) => s + p.savingsPerAcre, 0) / count) * 100
    ) / 100;

  const avgSim =
    scored.reduce((s, p) => s + p.similarityScore, 0) / count;

  return {
    peers: scored,
    averageNReduction,
    averageYieldChange,
    averageSavings,
    confidence: avgSim >= 0.75 ? "high" : avgSim >= 0.55 ? "medium" : "low",
    count,
  };
}
