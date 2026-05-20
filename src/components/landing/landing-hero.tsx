import Image from "next/image";
import { SketchButton } from "./sketch-button";
import {
  SketchArrowLeft,
  SketchArrowRight,
  SketchLeaves,
} from "./landing-decorations";
import { LandingNav } from "./landing-nav";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80";

export function LandingHero() {
  return (
    <section className="relative min-h-[85vh] w-full overflow-hidden bg-[#F4EFE4]">
      <div
        className="absolute top-0 left-0 right-0 z-20 h-[80px] pointer-events-none bg-[length:100%_100%] bg-top bg-no-repeat"
        style={{ backgroundImage: "url(/landing/hero-mask-top.svg)" }}
        aria-hidden
      />
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE}
          alt="Rustic barn in a green meadow with forest and mountains"
          fill
          priority
          className="object-cover object-center scale-105"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/35" />
      </div>

      <LandingNav />

      <div className="relative z-10 flex min-h-[85vh] flex-col items-center justify-center px-4 pb-28 pt-24 text-center">
        <p className="landing-label mb-2 text-white/90">Cape Girardeau · Midwest corn</p>
        <h1 className="landing-display max-w-3xl text-5xl text-white drop-shadow-md md:text-7xl">
          Our Story
        </h1>

        <div className="mt-10 flex items-center gap-4 md:gap-8">
          <SketchArrowLeft className="hidden text-white/80 sm:block" />
          <SketchLeaves className="text-white/70" />
          <SketchButton href="/wizard" variant="green" className="text-base px-8 py-3">
            Start wizard
          </SketchButton>
          <SketchLeaves className="scale-x-[-1] text-white/70" />
          <SketchArrowRight className="hidden text-white/80 sm:block" />
        </div>
      </div>

      {/* Torn paper transition to cream section */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-[120px] bg-[length:100%_100%] bg-bottom bg-no-repeat"
        style={{ backgroundImage: "url(/landing/hero-mask-bottom.svg)" }}
        aria-hidden
      />
    </section>
  );
}
