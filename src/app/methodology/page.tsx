import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SketchButton } from "@/components/landing/sketch-button";

const SECTIONS = [
  {
    title: "How nitrogen is estimated",
    body: "Uses MRTN-inspired economics: crop rotation, corn price, nitrogen price, prototype profitable-range priors, and bounded field-context risk positioning from weather/drainage context. We do not claim exact replication of the official Corn Nitrogen Rate Calculator.",
  },
  {
    title: "How P/K is estimated",
    body: "Soil-test categories and crop removal / maintenance logic when lab data is available. Without a soil test, conservative maintenance estimates are applied.",
  },
  {
    title: "How confidence is calculated",
    body: "Combines soil-test availability (30%), USDA soil match (20%), peer-field similarity (25%), weather risk (10%), and reduction aggressiveness (15%).",
  },
  {
    title: "Public APIs used",
    body: "USDA NRCS SSURGO (Soil Data Access), USDA NASS Quick Stats, National Weather Service, NOAA CDO (optional), USDA AMS fertilizer price defaults. Demo mode uses structured regional fallbacks when keys or services are unavailable.",
  },
  {
    title: "What SoilProve does not know",
    body: "Exact farm history, manure applications, last year's fertilizer, drainage tile, hybrid, planting date, and exact lab results unless you enter them.",
  },
];

export default function MethodologyPage() {
  return (
    <div className="landing-paper min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-12 space-y-8">
        <div className="space-y-3 border-l-4 border-[#4A6B45] pl-4">
          <Link href="/" className="text-xs text-[#6B4E3D] hover:underline">
            ← Back to home
          </Link>
          <h1 className="landing-display text-4xl text-[#1a1a1a]">Methodology</h1>
          <p className="text-[#555]">
            Rule-based, explainable agronomy — not a black-box ML prescription.
          </p>
        </div>
        {SECTIONS.map((s) => (
          <Card
            key={s.title}
            className="wizard-card border-[#2a2a2a]/15 bg-white/95 shadow-[3px_4px_0_rgba(42,42,42,0.08)]"
          >
            <CardHeader>
              <CardTitle className="landing-display text-xl text-[#1a1a1a]">
                {s.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-[#555]">{s.body}</p>
            </CardContent>
          </Card>
        ))}
        <SketchButton href="/wizard" variant="green">
          Start prescription wizard
        </SketchButton>
      </div>
    </div>
  );
}
