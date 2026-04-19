import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { BrutalCard } from "@/components/brutal/BrutalCard";
import { BrutalBadge } from "@/components/brutal/BrutalBadge";
import { BrutalButton } from "@/components/brutal/BrutalButton";
import { Marquee } from "@/components/brutal/Marquee";

const plans = [
  {
    name: "Free",
    price: "₹0",
    cadence: "forever",
    tone: "white" as const,
    cta: "Start Free",
    href: "/signup",
    features: [
      "Browse all open roles",
      "Basic profile + portfolio",
      "Apply to 5 roles / month",
      "Standard listing position",
    ],
  },
  {
    name: "Pro",
    price: "₹999",
    cadence: "/ month",
    tone: "pink" as const,
    cta: "Go Pro →",
    href: "/signup?plan=pro",
    features: [
      "Featured profile placement",
      "Unlimited applications",
      "Priority casting review",
      "Verified ★ badge",
      "Application analytics",
      "Early-access to roles",
    ],
    popular: true,
  },
];

const Pricing = () => (
  <SiteLayout>
    <section className="bg-foreground text-background border-b-[4px] border-foreground py-16 grain relative">
      <div className="container relative">
        <span className="font-display text-secondary text-sm tracking-[0.4em]">— Plans & Pricing —</span>
        <h1 className="font-display text-6xl md:text-8xl uppercase leading-none mt-3">
          Pick Your <span className="text-primary">Stage</span>
        </h1>
        <p className="font-mono mt-4 max-w-xl text-background/70">
          Start free. Upgrade when you're ready for the spotlight.
        </p>
      </div>
    </section>

    <Marquee tone="yellow" items={["★ MOST POPULAR — PRO", "BILLED MONTHLY", "CANCEL ANYTIME", "STRIPE SECURE"]} />

    <section className="container py-20">
      <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
        {plans.map((p) => (
          <BrutalCard
            key={p.name}
            tone={p.tone}
            shadow={p.popular ? "yellow" : "default"}
            className={`p-8 relative ${p.popular ? "md:-translate-y-4" : ""}`}
          >
            {p.popular && (
              <div className="absolute -top-4 -right-4 rotate-12">
                <BrutalBadge tone="yellow">★ Most Popular</BrutalBadge>
              </div>
            )}
            <div className="font-display text-3xl uppercase">{p.name}</div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-6xl">{p.price}</span>
              <span className="font-mono text-sm opacity-70">{p.cadence}</span>
            </div>

            <ul className="mt-8 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-3 font-mono text-sm">
                  <span className="mt-0.5 w-5 h-5 bg-foreground text-background border-[3px] border-foreground grid place-items-center shrink-0">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <BrutalButton
              asChild
              variant={p.popular ? "yellow" : "black"}
              size="lg"
              className="w-full mt-8"
            >
              <Link to={p.href}>{p.cta}</Link>
            </BrutalButton>
          </BrutalCard>
        ))}
      </div>

      <p className="text-center font-mono text-xs mt-10 opacity-60">
        Stripe-secured payments. GST included where applicable.
      </p>
    </section>
  </SiteLayout>
);

export default Pricing;
