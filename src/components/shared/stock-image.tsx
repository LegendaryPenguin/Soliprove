"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { STOCK } from "@/lib/images/stock-photos";

type StockImageProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  fallback?: string;
};

export function StockImage({
  src,
  alt,
  className,
  imageClassName,
  sizes = "400px",
  priority,
  fallback = STOCK.cornField,
}: StockImageProps) {
  const [current, setCurrent] = useState(src);

  return (
    <div className={cn("relative overflow-hidden bg-[#E7E0D0]", className)}>
      <Image
        src={current}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn(
          "object-cover sepia-[0.12] contrast-[1.05]",
          imageClassName
        )}
        onError={() => {
          if (current !== fallback) setCurrent(fallback);
        }}
      />
    </div>
  );
}
