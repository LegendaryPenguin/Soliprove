"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfidenceBadge } from "@/components/shared/confidence-badge";
import { StockImage } from "@/components/shared/stock-image";
import { STOCK } from "@/lib/images/stock-photos";
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
      <p className="text-sm text-[#555]">
        Peer matches are generated with your prescription. Complete the previous
        step first.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-[#555]">
        Demo peer outcomes are synthetic for validation. In production, this
        layer would use anonymized grower-submitted outcomes and
        agronomist-verified trials.
      </p>

      <Card className="border-2 border-[#3D5C3A] bg-[#4A6B45] text-white shadow-[3px_4px_0_#2d4529]">
        <CardContent className="grid gap-6 pt-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm text-white/80">
              {peerMatch.count} similar fields within 45 miles
            </p>
          </div>
          <div>
            <p className="text-sm text-white/80">Avg N reduction</p>
            <p className="landing-display text-2xl">
              {peerMatch.averageNReduction} lb/ac
            </p>
          </div>
          <div>
            <p className="text-sm text-white/80">Avg yield change</p>
            <p className="landing-display text-2xl">
              {peerMatch.averageYieldChange >= 0 ? "+" : ""}
              {peerMatch.averageYieldChange} bu/ac
            </p>
          </div>
          <div>
            <p className="text-sm text-white/80">Avg savings</p>
            <p className="landing-display text-2xl">
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
          <Badge
            key={b}
            variant="secondary"
            className="border border-[#E7E0D0] bg-[#FAF7EF] text-[#4A6B45]"
          >
            {b}
          </Badge>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {peerMatch.peers.slice(0, 6).map((peer, i) => (
          <Card
            key={peer.id}
            className="wizard-card overflow-hidden border-[#2a2a2a]/15 bg-white/95 shadow-[3px_4px_0_rgba(42,42,42,0.08)]"
          >
            <StockImage
              src={STOCK.peers[i % STOCK.peers.length]}
              alt={`Similar field ${String.fromCharCode(65 + i)}`}
              className="h-28 w-full border-b-2 border-[#E7E0D0]"
              sizes="200px"
            />
            <CardHeader className="pb-2">
              <CardTitle className="landing-display text-lg text-[#1a1a1a]">
                Peer Field {String.fromCharCode(65 + i)}
              </CardTitle>
              <p className="text-xs text-[#6B4E3D]">
                {peer.distanceMiles} miles · {peer.soilTexture}
              </p>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-[#444]">
              <p>Rotation: {peer.rotation.replace(/_/g, " ")}</p>
              <p>N reduction: {peer.nReductionLbAc} lb/ac</p>
              <p>Yield: {peer.yieldResultLabel}</p>
              <p className="font-semibold text-[#4A6B45]">
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
