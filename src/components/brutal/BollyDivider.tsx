import * as React from "react";

/** Bollywood poster-style divider with diamond/star pattern */
export const BollyDivider: React.FC<{ className?: string }> = ({ className }) => (
  <div className={className} aria-hidden>
    <div className="bolly-divider" />
  </div>
);
