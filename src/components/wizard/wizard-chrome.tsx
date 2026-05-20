import Link from "next/link";
import { SketchBranch } from "@/components/landing/landing-decorations";

export function WizardPageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="relative space-y-2 pb-2">
      <SketchBranch className="absolute -left-2 -top-2 hidden h-10 w-24 text-[#4A6B45]/25 md:block" />
      <Link
        href="/"
        className="inline-flex text-xs text-[#6B4E3D] hover:text-[#3D5C3A] hover:underline"
      >
        ← Back to home
      </Link>
      <h1 className="landing-display text-3xl text-[#1a1a1a] md:text-4xl">
        {title}
      </h1>
      <p className="max-w-2xl text-sm text-[#555] md:text-base">{subtitle}</p>
    </div>
  );
}
