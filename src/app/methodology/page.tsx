import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SECTIONS = [
  {
    title: "How nitrogen is estimated",
    body: "Uses MRTN-inspired economics: crop rotation, corn price, nitrogen price, regional baseline rates, organic matter adjustment, and weather risk modifiers. We do not claim exact replication of the official Corn Nitrogen Rate Calculator.",
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
    body: "USDA NRCS SSURGO (Soil Data Access), USDA NASS Quick Stats, National Weather Service, NOAA CDO (optional), USDA AMS fertilizer price defaults. Hackathon demo uses structured mocks when keys or services are unavailable.",
  },
  {
    title: "What SoilProve does not know",
    body: "Exact farm history, manure applications, last year's fertilizer, drainage tile, hybrid, planting date, and exact lab results unless you enter them.",
  },
];

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#123524]">Methodology</h1>
        <p className="text-[#6B7280] mt-2">
          Rule-based, explainable agronomy — not a black-box ML prescription.
        </p>
      </div>
      {SECTIONS.map((s) => (
        <Card key={s.title}>
          <CardHeader>
            <CardTitle className="text-lg">{s.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#6B7280] leading-relaxed">{s.body}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
