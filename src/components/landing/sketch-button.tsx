import Link from "next/link";
import { cn } from "@/lib/utils";

type SketchButtonProps = {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "green" | "brown" | "outline";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
};

export function SketchButton({
  href,
  onClick,
  children,
  variant = "green",
  className,
  disabled,
  type = "button",
}: SketchButtonProps) {
  const base =
    "inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold tracking-wide transition-transform hover:scale-[1.02] active:scale-[0.98]";

  const variants = {
    green:
      "bg-[#4A6B45] text-white border-2 border-[#3D5C3A] shadow-[2px_3px_0_#2d4529] rounded-[2px_8px_3px_6px]",
    brown:
      "bg-[#6B4E3D] text-white border-2 border-[#5A4030] shadow-[2px_2px_0_#4a3528] rounded-[3px_6px_4px_5px] min-w-[120px]",
    outline:
      "bg-transparent text-white border-2 border-white/90 rounded-[4px_10px_5px_8px] hover:bg-white/10",
  };

  const classes = cn(base, variants[variant], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(classes, disabled && "pointer-events-none opacity-50")}
    >
      {children}
    </button>
  );
}
