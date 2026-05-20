import Link from "next/link";
import { Sprout } from "lucide-react";
import { SketchButton } from "./sketch-button";
import { PlayCircleIcon } from "./landing-decorations";

export function LandingNav() {
  return (
    <nav className="absolute inset-x-0 top-0 z-30 px-4 py-4 md:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/80 bg-white/15 text-white backdrop-blur-sm"
            aria-label="SoilProve home"
          >
            <Sprout className="h-5 w-5" />
          </Link>
          <span className="hidden text-white/90 sm:inline-flex">
            <PlayCircleIcon className="h-9 w-9 opacity-90" />
          </span>
        </div>

        <ul className="hidden items-center gap-6 text-sm font-medium text-white/95 md:flex">
          <li>
            <Link href="/methodology" className="hover:text-white hover:underline">
              Methodology
            </Link>
          </li>
          <li>
            <Link href="/wizard" className="hover:text-white hover:underline">
              Prescription wizard
            </Link>
          </li>
          <li>
            <Link href="/methodology" className="hover:text-white hover:underline">
              How it works
            </Link>
          </li>
        </ul>

        <SketchButton href="/wizard" variant="outline" className="text-xs md:text-sm">
          Start free
        </SketchButton>
      </div>
    </nav>
  );
}
