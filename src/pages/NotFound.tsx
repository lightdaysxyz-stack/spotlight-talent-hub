import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { BrutalButton } from "@/components/brutal/BrutalButton";

const NotFound = () => (
  <SiteLayout>
    <section className="container py-32 text-center">
      <div className="font-display text-[24vw] md:text-[18vw] leading-none text-primary tilt-neg">
        404
      </div>
      <h1 className="font-display text-3xl md:text-5xl uppercase mt-4">
        Cut! This scene doesn't exist.
      </h1>
      <p className="font-mono mt-4 max-w-md mx-auto">
        The page you're looking for never made it past the cutting room floor.
      </p>
      <BrutalButton asChild variant="primary" size="lg" className="mt-8">
        <Link to="/">← Back to Stage</Link>
      </BrutalButton>
    </section>
  </SiteLayout>
);

export default NotFound;
