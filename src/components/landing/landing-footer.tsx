import Link from "next/link";
import { SketchButton } from "./sketch-button";
import { SketchLeaves } from "./landing-decorations";

export function LandingFooter() {
  return (
    <footer className="relative bg-[#3D5C3A] text-white">
      <div className="relative -mt-1 h-0">
        <SketchLeaves className="absolute left-[8%] top-2 z-10 text-[#2d4529]" />
        <SketchLeaves className="absolute right-[12%] top-0 z-10 scale-x-[-1] text-[#2d4529]" />
      </div>
      <div
        className="h-[100px] w-full bg-[length:100%_100%] bg-top bg-no-repeat"
        style={{ backgroundImage: "url(/landing/footer-wave-top.svg)" }}
        aria-hidden
      />

      <div className="relative px-4 pb-0 pt-4 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex justify-center">
            <SketchLeaves className="text-white/50" />
          </div>

          <h2 className="landing-display mb-12 text-center text-3xl text-white md:text-4xl">
            Grow with confidence
          </h2>

          <div className="grid gap-10 pb-16 md:grid-cols-[1fr_1fr_1.2fr] md:gap-8">
            {/* Brown data grid box — reference left panel */}
            <div className="rounded-sm border-2 border-[#5A4030] bg-[#6B4E3D] p-4 shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)]">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#E8D5C4]">
                Example field · Cape Girardeau
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  ["N rate", "168 lb/ac"],
                  ["Savings", "$18.70/ac"],
                  ["Confidence", "84%"],
                  ["Soil", "Sharkey clay"],
                  ["Yield ref", "192 bu/ac"],
                  ["Zones", "3"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="border border-[#8B6B4F]/50 bg-[#5A4030]/60 px-2 py-2"
                  >
                    <p className="text-[10px] uppercase text-[#C4A882]">{k}</p>
                    <p className="font-semibold text-white">{v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Link columns */}
            <div className="grid grid-cols-2 gap-8 text-sm">
              <ul className="space-y-2">
                <li className="font-semibold text-[#E8D5C4]">Product</li>
                <li>
                  <Link href="/wizard" className="hover:underline">
                    Start wizard
                  </Link>
                </li>
                <li>
                  <Link href="/methodology" className="hover:underline">
                    Methodology
                  </Link>
                </li>
                <li>
                  <Link href="/methodology" className="hover:underline">
                    Data sources
                  </Link>
                </li>
              </ul>
              <ul className="space-y-2">
                <li className="font-semibold text-[#E8D5C4]">Resources</li>
                <li>
                  <a href="https://www.nrcs.usda.gov" className="hover:underline">
                    USDA NRCS
                  </a>
                </li>
                <li>
                  <a href="https://quickstats.nass.usda.gov" className="hover:underline">
                    NASS Quick Stats
                  </a>
                </li>
                <li>
                  <a href="https://www.weather.gov" className="hover:underline">
                    National Weather Service
                  </a>
                </li>
              </ul>
            </div>

            {/* Cream signup panel — reference right box */}
            <div className="rounded-sm border-2 border-[#E7E0D0] bg-[#F4EFE4] p-6 text-[#1a1a1a] shadow-lg">
              <p className="landing-display mb-2 text-2xl text-[#3D5C3A]">
                Ready to plan?
              </p>
              <p className="mb-4 text-sm text-[#555]">
                Open the wizard with Cape Girardeau as your default field—or drop a
                pin anywhere in the Midwest.
              </p>
              <SketchButton href="/wizard" variant="green" className="w-full">
                Open prescription wizard
              </SketchButton>
              <p className="mt-4 text-xs text-[#777]">
                Decision-support only. Review final rates with your crop adviser.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="h-12 w-full bg-[length:100%_100%] bg-bottom bg-no-repeat"
        style={{ backgroundImage: "url(/landing/fence-bottom.svg)" }}
        aria-hidden
      />
    </footer>
  );
}
