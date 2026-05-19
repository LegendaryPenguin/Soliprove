import Link from "next/link";
import { Sprout } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-[#E7E0D0] bg-white/90 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-[#123524]">
          <Sprout className="h-6 w-6 text-[#1F6F43]" />
          SoilProve
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/wizard" className="text-[#1F6F43] font-medium hover:underline">
            Start wizard
          </Link>
          <Link href="/methodology" className="text-[#6B7280] hover:text-[#123524]">
            Methodology
          </Link>
        </nav>
      </div>
    </header>
  );
}
