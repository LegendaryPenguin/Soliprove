"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfidenceBadge } from "@/components/shared/confidence-badge";
import { formatCurrency } from "@/lib/utils";
import { useSoilProve } from "@/context/soilprove-context";

const SIMILARITY_BADGES = [
  "Same rotation",
  "Similar soil texture",
  "Similar organic matter",
  "Similar yield benchmark",
  "Within 45 miles",
  "Similar drainage class",
];

export function StepPeers() {
  const { peerMatch } = useSoilProve();

  if (!peerMatch) {
    return (
      <p className="text-sm text-[#6B7280]">
        Peer matches are generated with your prescription. Complete the previous
        step first.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-[#6B7280]">
        Demo peer outcomes are synthetic for hackathon validation. In production,
        this layer would use anonymized grower-submitted outcomes and
        agronomist-verified trials.
      </p>

      <Card className="bg-[#1F6F43] text-white border-0 shadow-md">
        <CardContent className="pt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-white/80 text-sm">
              {peerMatch.count} similar fields within 45 miles
            </p>
          </div>
          <div>
            <p className="text-white/80 text-sm">Avg N reduction</p>
            <p className="text-2xl font-bold">{peerMatch.averageNReduction} lb/ac</p>
          </div>
          <div>
            <p className="text-white/80 text-sm">Avg yield change</p>
            <p className="text-2xl font-bold">
              {peerMatch.averageYieldChange >= 0 ? "+" : ""}
              {peerMatch.averageYieldChange} bu/ac
            </p>
          </div>
          <div>
            <p className="text-white/80 text-sm">Avg savings</p>
            <p className="text-2xl font-bold">
              {formatCurrency(peerMatch.averageSavings)}/ac
            </p>
            <div className="mt-2 [&_*]:text-white">
              <ConfidenceBadge level={peerMatch.confidence} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        {SIMILARITY_BADGES.map((b) => (
          <Badge key={b} variant="secondary">
            {b}
          </Badge>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {peerMatch.peers.slice(0, 6).map((peer, i) => (
          <Card key={peer.id} className="shadow-none border-[#E7E0D0]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Peer Field {String.fromCharCode(65 + i)}
              </CardTitle>
              <p className="text-xs text-[#6B7280]">
                {peer.distanceMiles} miles · {peer.soilTexture}
              </p>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p>Rotation: {peer.rotation.replace(/_/g, " ")}</p>
              <p>N reduction: {peer.nReductionLbAc} lb/ac</p>
              <p>Yield: {peer.yieldResultLabel}</p>
              <p className="font-semibold text-[#1F6F43]">
                Savings: {formatCurrency(peer.savingsPerAcre)}/ac
              </p>
              <p className="text-xs text-[#6B7280]">
                Match score: {(peer.similarityScore * 100).toFixed(0)}%
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
