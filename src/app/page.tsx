import Link from "next/link";
import { MapPinned, ShieldCheck, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      <section className="mx-auto max-w-6xl px-4 py-16 lg:py-24 text-center lg:text-left">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-medium text-[#1F6F43] uppercase tracking-wider mb-4">
              Transparent · Field-specific · Explainable
            </p>
            <h1 className="text-4xl lg:text-5xl font-bold text-[#123524] leading-tight">
              Smarter fertilizer rates, backed by soil data and nearby proof.
            </h1>
            <p className="mt-6 text-lg text-[#6B7280] max-w-xl">
              SoilProve turns field location, public soil data, crop economics,
              and optional soil tests into transparent corn fertilizer
              prescriptions.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/wizard">Start wizard</Link>
            </Button>
            <p className="text-sm text-[#6B7280] mt-3">
              6 guided steps · field location to export
            </p>
          </div>
          <div className="hidden lg:block rounded-2xl border border-[#E7E0D0] bg-white p-8 shadow-sm">
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
              Example prescription — Champaign County, IL demo field
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 grid md:grid-cols-3 gap-6">
        {CARDS.map(({ icon: Icon, title, body }) => (
          <Card key={title}>
            <CardHeader>
              <Icon className="h-8 w-8 text-[#1F6F43] mb-2" />
              <CardTitle className="text-lg">{title}</CardTitle>
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
