import { BrutalCard } from "@/components/brutal/BrutalCard";
import { ShieldCheck, Clapperboard, IndianRupee } from "lucide-react";

const items = [
  {
    icon: ShieldCheck,
    title: "Verified Talent",
    desc: "Every profile vetted. No catfish, no chaos. Only real sitare ready for the lens.",
    tone: "yellow" as const,
  },
  {
    icon: Clapperboard,
    title: "Direct Casting",
    desc: "Skip the agencies. Cast directors post. Models apply. Pure, brutal efficiency.",
    tone: "pink" as const,
  },
  {
    icon: IndianRupee,
    title: "Secure Payments",
    desc: "Stripe-powered escrow. Get paid the moment you're hired. No follow-ups required.",
    tone: "saffron" as const,
  },
];

export const WhySpotlight = () => (
  <section className="relative py-20 md:py-28 bg-foreground text-background grain overflow-hidden">
    <div className="absolute inset-0 grid-lines opacity-30" />
    <div className="relative container">
      <h2 className="font-display text-5xl md:text-7xl uppercase leading-none">
        Why <span className="text-secondary">Spotlight?</span>
      </h2>
      <p className="mt-3 font-mono text-background/70 max-w-xl">
        Three reasons. Zero fluff.
      </p>

      <div className="mt-14 grid md:grid-cols-3 gap-8 md:gap-10">
        {items.map((item, i) => (
          <BrutalCard
            key={item.title}
            tone={item.tone}
            shadow="lg"
            className={`p-7 ${i === 1 ? "md:translate-y-6" : ""} ${i === 2 ? "md:-translate-y-3" : ""}`}
          >
            <div className="w-14 h-14 bg-foreground text-background border-[3px] border-foreground grid place-items-center mb-5">
              <item.icon size={28} />
            </div>
            <h3 className="font-display text-2xl uppercase">{item.title}</h3>
            <p className="font-mono text-sm mt-3 leading-relaxed">{item.desc}</p>
            <div className="mt-6 font-display text-5xl opacity-20">0{i + 1}</div>
          </BrutalCard>
        ))}
      </div>
    </div>
  </section>
);
