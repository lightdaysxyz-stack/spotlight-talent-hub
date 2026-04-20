import { SiteLayout } from "@/components/layout/SiteLayout";
import { BrutalCard } from "@/components/brutal/BrutalCard";
import { BrutalBadge } from "@/components/brutal/BrutalBadge";
import { BrutalButton } from "@/components/brutal/BrutalButton";
import { BollyDivider } from "@/components/brutal/BollyDivider";
import { Link } from "react-router-dom";
import { Sparkles, Film, Users, Rocket } from "lucide-react";

const values = [
  { icon: Sparkles, title: "Talent First", body: "Every reel deserves a real shot. No gatekeepers, no middlemen." },
  { icon: Film, title: "Built for Set", body: "Crafted with casting directors who actually run productions in Mumbai, Delhi & beyond." },
  { icon: Users, title: "Verified Community", body: "Real people, real roles, real auditions. Zero spam, zero scams." },
  { icon: Rocket, title: "Move Fast", body: "Apply, shortlist, message — all in one stage. Casting cycles in days, not months." },
];

const team = [
  { name: "Aarav Mehta", role: "Co-founder & CEO", tag: "ex-Yash Raj" },
  { name: "Zoya Kapoor", role: "Co-founder & CPO", tag: "ex-Dharma Casting" },
  { name: "Rohan Iyer", role: "Head of Engineering", tag: "ex-Razorpay" },
  { name: "Priya Nair", role: "Head of Talent", tag: "ex-Anurag Kashyap Films" },
];

const About = () => {
  return (
    <SiteLayout>
      <section className="relative border-b-[4px] border-foreground bg-secondary overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-40" />
        <div className="container py-20 md:py-28 relative">
          <BrutalBadge className="mb-6">About Spotlight</BrutalBadge>
          <h1 className="font-display text-5xl md:text-7xl leading-[0.9] max-w-4xl">
            We're building the <span className="text-primary">backstage</span> of Indian casting.
          </h1>
          <p className="mt-6 font-mono text-base md:text-lg max-w-2xl text-foreground/80">
            Spotlight is where models, actors and casting directors meet without the noise. Born on a film set,
            built like a brick — loud, sharp, and honest.
          </p>
        </div>
      </section>

      <BollyDivider />

      {/* Values */}
      <section className="bg-foreground text-background py-16 md:py-24 border-y-[4px] border-foreground">
        <div className="container">
          <h2 className="font-display text-4xl md:text-5xl text-secondary">What we stand for</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="bg-background text-foreground p-6 brutal-border brutal-shadow">
                <v.icon size={28} className="mb-4" />
                <h3 className="font-display text-xl">{v.title}</h3>
                <p className="font-mono text-sm mt-2 text-foreground/80">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="container py-16 md:py-24">
        <h2 className="font-display text-4xl md:text-5xl">The Cast</h2>
        <p className="font-mono text-foreground/70 mt-2 max-w-xl">
          A small crew of film nerds and engineers obsessed with shipping.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m, i) => (
            <BrutalCard key={m.name} className={`p-6 ${i % 2 === 0 ? "bg-secondary" : "bg-background"}`}>
              <div className="w-16 h-16 brutal-border bg-foreground text-secondary grid place-items-center font-display text-2xl">
                {m.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <h3 className="font-display text-xl mt-4">{m.name}</h3>
              <p className="font-mono text-sm text-foreground/70">{m.role}</p>
              <span className="inline-block mt-3 text-xs font-mono uppercase tracking-wider border-2 border-foreground px-2 py-1">
                {m.tag}
              </span>
            </BrutalCard>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-20">
        <div className="brutal-border brutal-shadow-lg bg-primary text-primary-foreground p-10 md:p-14 text-center">
          <h2 className="font-display text-3xl md:text-5xl">Ready for your close-up?</h2>
          <p className="font-mono mt-3 max-w-xl mx-auto">
            Join thousands of models and casting directors building India's next reel together.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <BrutalButton asChild variant="yellow"><Link to="/signup">Join Spotlight</Link></BrutalButton>
            <BrutalButton asChild variant="outline" className="bg-background"><Link to="/contact">Talk to us</Link></BrutalButton>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default About;
