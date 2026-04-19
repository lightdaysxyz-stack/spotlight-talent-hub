import { BrutalCard } from "@/components/brutal/BrutalCard";

const quotes = [
  {
    quote: "Spotlight ne meri zindagi badal di. Three weeks, two campaigns, one Bollywood debut.",
    name: "Priya R.",
    role: "Lead Model · Mumbai",
    tone: "yellow" as const,
    tilt: "tilt-1",
  },
  {
    quote: "Posted a role on Monday. Cast my hero on Wednesday. SPOTLIGHT is unfair to everyone else.",
    name: "Vikram S.",
    role: "Casting Director · Yash Raj Studios",
    tone: "pink" as const,
    tilt: "tilt-2",
  },
  {
    quote: "Finally — a platform that pays models on time. Roshni in the dark casting world.",
    name: "Anjali D.",
    role: "Editorial Model · Delhi",
    tone: "white" as const,
    tilt: "tilt-neg",
  },
];

export const Testimonials = () => (
  <section className="relative py-20 md:py-28">
    <div className="container">
      <div className="text-center mb-14">
        <span className="font-display text-primary text-sm uppercase tracking-[0.4em]">— Box Office Reviews —</span>
        <h2 className="mt-4 font-display text-5xl md:text-7xl uppercase leading-none">
          The Audience <span className="text-primary">Speaks</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        {quotes.map((q) => (
          <BrutalCard key={q.name} tone={q.tone} shadow="default" className={`p-7 ${q.tilt}`}>
            <span className="font-display text-7xl leading-none opacity-30">"</span>
            <p className="font-mono text-base leading-relaxed -mt-6">{q.quote}</p>
            <div className="mt-6 pt-4 border-t-[3px] border-foreground">
              <div className="font-display uppercase">{q.name}</div>
              <div className="font-mono text-xs opacity-70">{q.role}</div>
            </div>
          </BrutalCard>
        ))}
      </div>
    </div>
  </section>
);
