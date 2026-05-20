import { LandingHero } from "@/components/landing/landing-hero";
import { LandingFeatures } from "@/components/landing/landing-features";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function HomePage() {
  return (
    <div className="landing-page -mt-0">
      <LandingHero />
      <LandingFeatures />
      <LandingFooter />
    </div>
  );
}
