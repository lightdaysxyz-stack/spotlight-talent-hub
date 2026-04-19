import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

/**
 * Brutalist button — thick black border, hard offset shadow,
 * shadow shifts on hover (press effect). Sharp corners always.
 */
const brutalButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-display uppercase tracking-wide whitespace-nowrap select-none brutal-press border-[3px] border-foreground disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground brutal-shadow",
        yellow: "bg-secondary text-secondary-foreground brutal-shadow",
        black: "bg-foreground text-background brutal-shadow",
        outline: "bg-background text-foreground brutal-shadow",
        accent: "bg-accent text-accent-foreground brutal-shadow",
        ghost: "border-transparent shadow-none hover:bg-foreground hover:text-background",
      },
      size: {
        sm: "h-10 px-4 text-xs",
        md: "h-12 px-6 text-sm",
        lg: "h-14 px-8 text-base",
        xl: "h-16 px-10 text-lg",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface BrutalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof brutalButtonVariants> {
  asChild?: boolean;
}

export const BrutalButton = React.forwardRef<HTMLButtonElement, BrutalButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(brutalButtonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
BrutalButton.displayName = "BrutalButton";

export { brutalButtonVariants };
