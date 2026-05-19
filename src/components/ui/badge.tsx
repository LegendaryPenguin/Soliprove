import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-[#1F6F43]/10 text-[#1F6F43]",
        secondary: "bg-[#E7E0D0] text-[#123524]",
        accent: "bg-[#F2C94C]/40 text-[#123524]",
        outline: "border border-[#E7E0D0] text-[#6B7280]",
        high: "bg-[#22C55E]/15 text-[#166534]",
        medium: "bg-[#FACC15]/25 text-[#854d0e]",
        low: "bg-[#EF4444]/15 text-[#991b1b]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
