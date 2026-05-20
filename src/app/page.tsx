import Link from "next/link";
import { MapPinned, ShieldCheck, Sprout, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WIZARD_STEPS } from "@/lib/wizard/steps";

const CARDS = [
  {
    icon: MapPinned,
    title: "Auto-pull field context",
    body: "USDA soil, crop, weather, and regional price data.",
  },
  {
    icon: Sprout,
    title: "Generate a prescription",
    body: "N, P, and K rates with savings and yield-risk confidence.",
  },
  {
    icon: ShieldCheck,
    title: "Build farmer trust",
    body: "Compare against similar nearby fields and documented outcomes.",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#1F6F43_0%,_transparent_50%)] opacity-[0.07]" />
        <div className="mx-auto max-w-6xl px-4 py-16 lg:py-24 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-medium text-[#1F6F43] uppercase tracking-wider mb-4">
                Transparent Â· Field-specific Â· Explainable
              </p>
              <h1 className="text-4xl lg:text-5xl font-bold text-[#123524] leading-tight font-display">
                Smarter fertilizer rates, backed by soil data and nearby proof.
              </h1>
              <p className="mt-6 text-lg text-[#6B7280] max-w-xl">
                SoilProve turns field location, public soil data, crop economics,
                and optional soil tests into transparent corn fertilizer
                prescriptions.
              </p>
              <Button asChild size="lg" className="mt-8 shadow-md">
                <Link href="/wizard">
                  Start wizard <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <p className="text-sm text-[#6B7280] mt-3">
                6 guided steps Â· satellite field map Â· export to equipment
              </p>
            </div>
            <Card className="card-elevated p-8 hidden lg:block">
              <p className="text-xs text-[#6B7280] uppercase tracking-wide mb-4">
                Example outcome
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-[#1F6F43]">158</p>
                  <p className="text-xs text-[#6B7280]">lb N/ac</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#F2C94C]">$18.70</p>
                  <p className="text-xs text-[#6B7280]">saved / ac</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#8B5E3C]">84%</p>
                  <p className="text-xs text-[#6B7280]">confidence</p>
                </div>
              </div>
              <p className="text-sm text-[#6B7280] mt-6 text-center">
                Cape Girardeau County, MO demo field
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8">
        <p className="text-center text-sm text-[#6B7280] mb-4">How it works</p>
        <ol className="flex flex-wrap justify-center gap-2">
          {WIZARD_STEPS.map((s) => (
            <li
              key={s.id}
              className="text-xs rounded-full border border-[#E7E0D0] bg-white px-3 py-1 text-[#123524]"
            >
              {s.number}. {s.label}
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 grid md:grid-cols-3 gap-6">
        {CARDS.map(({ icon: Icon, title, body }) => (
          <Card key={title} className="card-elevated">
            <CardHeader>
              <Icon className="h-8 w-8 text-[#1F6F43] mb-2" />
              <CardTitle className="text-lg font-display">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#6B7280]">{body}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}

