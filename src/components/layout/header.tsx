"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sprout } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  if (isLanding) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b-2 border-[#E7E0D0] bg-[#F4EFE4]/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="landing-display flex items-center gap-2 text-xl text-[#1a1a1a]"
        >
          <Sprout className="h-6 w-6 text-[#4A6B45]" />
          SoilProve
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link
            href="/wizard"
            className="text-[#4A6B45] hover:text-[#3D5C3A] hover:underline"
          >
            Start wizard
          </Link>
          <Link
            href="/methodology"
            className="text-[#6B4E3D] hover:text-[#3D5C3A] hover:underline"
          >
            Methodology
          </Link>
          <Link
            href="/"
            className="hidden text-[#6B4E3D] hover:underline sm:inline"
          >
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
}
