import { LANDING_CARDS } from "@/lib/images/stock-photos";
import { StockImage } from "@/components/shared/stock-image";
import { SketchButton } from "./sketch-button";
import { SketchBranch } from "./landing-decorations";

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
          {LANDING_CARDS.map((card) => (
            <article
              key={card.title}
              className="flex flex-col items-center text-center"
            >
              <StockImage
                src={card.image}
                alt={card.alt}
                className="mb-5 aspect-[4/3] w-full max-w-[280px] border-[3px] border-[#2a2a2a]/80 shadow-[4px_5px_0_rgba(42,42,42,0.15)]"
                sizes="280px"
              />
              <h3 className="landing-display mb-3 text-2xl text-[#1a1a1a]">
                {card.title}
              </h3>
              <p className="mb-6 flex-1 px-2 text-sm leading-relaxed text-[#555]">
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
