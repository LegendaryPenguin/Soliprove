import Image from "next/image";
import { SketchButton } from "./sketch-button";
import { SketchBranch } from "./landing-decorations";

const CARDS = [
  {
    image:
      "https://images.unsplash.com/photo-1625246333195-78d9c38a308e?w=600&q=80",
    title: "Field context",
    body: "Pull USDA soil, county yield, weather, and regional fertilizer prices from your pin or drawn boundary.",
    cta: "Learn more",
    href: "/methodology",
  },
  {
    image:
      "https://images.unsplash.com/photo-1574323863100-15506133fd3c?w=600&q=80",
    title: "Your prescription",
    body: "Transparent N, P, and K rates with savings estimates and yield-risk confidence—no black box.",
    cta: "Build plan",
    href: "/wizard",
  },
  {
    image:
      "https://images.unsplash.com/photo-1501594907357-962cdeeda703?w=600&q=80",
    title: "Nearby proof",
    body: "See how similar fields in your area adjusted rates and what outcomes growers reported.",
    cta: "See peers",
    href: "/wizard",
  },
];

export function LandingFeatures() {
  return (
    <section className="landing-paper relative px-4 pb-20 pt-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="relative mb-12 text-center">
          <SketchBranch className="absolute -left-4 top-0 hidden text-[#4A6B45]/40 lg:block" />
          <h2 className="landing-display text-4xl text-[#1a1a1a] md:text-5xl">
            Join Us
          </h2>
          <SketchBranch className="absolute -right-4 top-0 hidden scale-x-[-1] text-[#4A6B45]/40 lg:block" />
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#4a4a4a]">
            SoilProve guides you from satellite field map to exportable prescription in
            six steps—built for Midwest corn growers who want clarity before they spread.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {CARDS.map((card) => (
            <article
              key={card.title}
              className="flex flex-col items-center text-center"
            >
              <div className="relative mb-5 aspect-[4/3] w-full max-w-[280px] overflow-hidden border-[3px] border-[#2a2a2a]/80 shadow-[4px_5px_0_rgba(42,42,42,0.15)]">
                <Image
                  src={card.image}
                  alt=""
                  fill
                  className="object-cover sepia-[0.15] contrast-[1.05]"
                  sizes="280px"
                />
              </div>
              <h3 className="landing-display mb-3 text-2xl text-[#1a1a1a]">
                {card.title}
              </h3>
              <p className="mb-6 flex-1 text-sm leading-relaxed text-[#555] px-2">
                {card.body}
              </p>
              <SketchButton href={card.href} variant="brown">
                {card.cta}
              </SketchButton>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
