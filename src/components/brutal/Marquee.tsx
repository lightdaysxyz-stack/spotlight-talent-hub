import * as React from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  tone?: "yellow" | "pink" | "black";
  speed?: "normal" | "fast";
  className?: string;
}

export const Marquee: React.FC<MarqueeProps> = ({
  items,
  tone = "black",
  speed = "normal",
  className,
}) => {
  const tones = {
    yellow: "bg-secondary text-foreground border-y-[4px] border-foreground",
    pink: "bg-primary text-primary-foreground border-y-[4px] border-foreground",
    black: "bg-foreground text-secondary border-y-[4px] border-foreground",
  };
  const doubled = [...items, ...items];
  return (
    <div className={cn("overflow-hidden py-3", tones[tone], className)}>
      <div
        className={cn(
          "flex gap-10 whitespace-nowrap font-display text-xl md:text-2xl uppercase tracking-wider",
          speed === "fast" ? "marquee-track-fast" : "marquee-track"
        )}
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-10">
            {item}
            <span aria-hidden className="text-3xl leading-none">★</span>
          </span>
        ))}
      </div>
    </div>
  );
};
