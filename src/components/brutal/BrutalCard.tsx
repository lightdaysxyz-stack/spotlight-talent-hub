import * as React from "react";
import { cn } from "@/lib/utils";

interface BrutalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: "white" | "yellow" | "pink" | "black" | "saffron";
  shadow?: "default" | "pink" | "yellow" | "lg" | "none";
}

export const BrutalCard = React.forwardRef<HTMLDivElement, BrutalCardProps>(
  ({ className, tone = "white", shadow = "default", ...props }, ref) => {
    const tones: Record<string, string> = {
      white: "bg-card text-card-foreground",
      yellow: "bg-secondary text-secondary-foreground",
      pink: "bg-primary text-primary-foreground",
      black: "bg-foreground text-background",
      saffron: "bg-accent text-accent-foreground",
    };
    const shadows: Record<string, string> = {
      default: "brutal-shadow",
      pink: "brutal-shadow-pink",
      yellow: "brutal-shadow-yellow",
      lg: "brutal-shadow-lg",
      none: "",
    };
    return (
      <div
        ref={ref}
        className={cn(
          "brutal-border-thick relative",
          tones[tone],
          shadows[shadow],
          className
        )}
        {...props}
      />
    );
  }
);
BrutalCard.displayName = "BrutalCard";
