import heroBg from "@/assets/hero-bollywood.jpg";
import { Link } from "react-router-dom";
import { BrutalButton } from "@/components/brutal/BrutalButton";
import { BrutalBadge } from "@/components/brutal/BrutalBadge";

export const Hero = () => (
  <section className="relative overflow-hidden border-b-[4px] border-foreground bg-foreground text-background grain">
    <img
      src={heroBg}
      alt="Bollywood film reel and clapperboard collage"
      width={1920}
      height={1080}
      className="absolute inset-0 w-full h-full object-cover opacity-50"
    />
    <div className="spotlight-sweep" />
    <div className="absolute inset-0 grid-lines opacity-40" />

    <div className="relative container pt-20 pb-28 md:pt-28 md:pb-36">
      <div className="flex items-center gap-3 mb-6 animate-hard-in">
        <BrutalBadge tone="yellow" tilt>● LIVE NOW</BrutalBadge>
        <span className="font-mono text-xs uppercase tracking-widest text-secondary">
          Casting season 2025
        </span>
      </div>

      <h1 className="font-display text-[15vw] md:text-[10vw] leading-[0.85] uppercase tracking-tighter -ml-1 md:-ml-3 animate-hard-in">
        <span className="block tilt-1">Your Moment.</span>
        <span className="block text-secondary tilt-2">Your Stage.</span>
      </h1>

      <p className="mt-8 max-w-xl font-mono text-base md:text-lg text-background/85">
        SPOTLIGHT is the brutal, beautiful hiring stage where models meet
        casting directors. No agents. No middlemen. Just{" "}
        <span className="text-secondary font-bold">JUNOON</span>.
      </p>

      <div className="mt-10 flex flex-wrap gap-4">
        <BrutalButton asChild variant="primary" size="xl">
          <Link to="/signup">Join Spotlight →</Link>
        </BrutalButton>
        <BrutalButton asChild variant="yellow" size="xl">
          <Link to="/roles">Browse Roles</Link>
        </BrutalButton>
      </div>

      {/* Floating Hindi accents */}
      <span className="hidden md:block absolute right-8 top-24 font-display text-7xl text-primary tilt-neg select-none">
        SITARA
      </span>
      <span className="hidden md:block absolute right-20 bottom-16 font-display text-5xl text-secondary tilt-2 select-none">
        ROSHNI
      </span>
    </div>
  </section>
);
