import * as React from "react";
import { cn } from "@/lib/utils";

interface BrutalBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: "yellow" | "pink" | "black" | "saffron" | "red" | "green" | "white";
  tilt?: boolean;
}

export const BrutalBadge = React.forwardRef<HTMLSpanElement, BrutalBadgeProps>(
  ({ className, tone = "yellow", tilt = false, ...props }, ref) => {
    const tones: Record<string, string> = {
      yellow: "bg-secondary text-secondary-foreground",
      pink: "bg-primary text-primary-foreground",
      black: "bg-foreground text-background",
      saffron: "bg-accent text-accent-foreground",
      red: "bg-destructive text-destructive-foreground",
      green: "bg-success text-success-foreground",
      white: "bg-background text-foreground",
    };
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1 px-3 py-1 text-xs font-display uppercase tracking-wider border-[3px] border-foreground",
          tones[tone],
          tilt && "tilt-2",
          className
        )}
        {...props}
      />
    );
  }
);
BrutalBadge.displayName = "BrutalBadge";
