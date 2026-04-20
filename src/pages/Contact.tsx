import { SiteLayout } from "@/components/layout/SiteLayout";
import { BrutalCard } from "@/components/brutal/BrutalCard";
import { BrutalBadge } from "@/components/brutal/BrutalBadge";
import { BrutalButton } from "@/components/brutal/BrutalButton";
import { BollyDivider } from "@/components/brutal/BollyDivider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Instagram, Youtube, Twitter } from "lucide-react";
import { useState } from "react";

const Contact = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // For now, simulate send. Wire to an edge function + Resend later.
    await new Promise((r) => setTimeout(r, 700));
    toast({
      title: "Message sent ✨",
      description: "Our team will get back to you within 1 business day.",
    });
    setForm({ name: "", email: "", subject: "", message: "" });
    setSubmitting(false);
  };

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative border-b-[4px] border-foreground bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-20" />
        <div className="container py-20 md:py-28 relative">
          <BrutalBadge className="mb-6 bg-secondary text-foreground">Contact</BrutalBadge>
          <h1 className="font-display text-5xl md:text-7xl leading-[0.9] max-w-4xl">
            Drop us a <span className="text-secondary">line</span>. We read every one.
          </h1>
          <p className="mt-6 font-mono text-base md:text-lg max-w-2xl text-primary-foreground/90">
            Press, partnerships, support, or just to say hi — we're loud here, but we listen louder.
          </p>
        </div>
      </section>

      <BollyDivider />

      {/* Form + Info */}
      <section className="container py-16 md:py-24 grid gap-10 lg:grid-cols-3">
        {/* Form */}
        <BrutalCard className="lg:col-span-2 p-6 md:p-10 bg-background">
          <h2 className="font-display text-3xl md:text-4xl">Send a message</h2>
          <p className="font-mono text-sm text-foreground/70 mt-2">
            Fill the form and we'll respond within 1 business day.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <Label htmlFor="name" className="font-display uppercase text-xs tracking-wider">Your Name</Label>
                <Input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-2 brutal-border rounded-none h-12"
                  placeholder="Aarav Mehta"
                />
              </div>
              <div>
                <Label htmlFor="email" className="font-display uppercase text-xs tracking-wider">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-2 brutal-border rounded-none h-12"
                  placeholder="you@studio.com"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="subject" className="font-display uppercase text-xs tracking-wider">Subject</Label>
              <Input
                id="subject"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="mt-2 brutal-border rounded-none h-12"
                placeholder="Casting collaboration for our next short"
              />
            </div>
            <div>
              <Label htmlFor="message" className="font-display uppercase text-xs tracking-wider">Message</Label>
              <Textarea
                id="message"
                required
                rows={6}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="mt-2 brutal-border rounded-none"
                placeholder="Tell us what's on your mind..."
              />
            </div>
            <BrutalButton type="submit" variant="primary" disabled={submitting} className="justify-self-start">
              {submitting ? "Sending..." : "Send Message"}
            </BrutalButton>
          </form>
        </BrutalCard>

        {/* Info */}
        <div className="space-y-6">
          <BrutalCard className="p-6 bg-secondary">
            <h3 className="font-display text-2xl">Reach us directly</h3>
            <ul className="mt-5 space-y-4 font-mono text-sm">
              <li className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5" />
                <div>
                  <div className="font-bold">Email</div>
                  <a href="mailto:lightdaysxyz@gmail.com" className="hover:underline">lightdaysxyz@gmail.com</a>
                </div>
              </li>
            </ul>
          </BrutalCard>

          <BrutalCard className="p-6 bg-foreground text-background">
            <h3 className="font-display text-2xl text-secondary">Follow the show</h3>
            <p className="font-mono text-sm mt-2 text-background/70">
              Behind-the-scenes, casting calls, and weekly reels.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" aria-label="Instagram" className="border-[3px] border-secondary p-3 hover:bg-secondary hover:text-foreground"><Instagram size={18} /></a>
              <a href="#" aria-label="YouTube" className="border-[3px] border-secondary p-3 hover:bg-secondary hover:text-foreground"><Youtube size={18} /></a>
              <a href="#" aria-label="Twitter" className="border-[3px] border-secondary p-3 hover:bg-secondary hover:text-foreground"><Twitter size={18} /></a>
            </div>
          </BrutalCard>
        </div>
      </section>

      {/* FAQ teaser */}
      <section className="bg-foreground text-background py-16 border-y-[4px] border-foreground">
        <div className="container grid gap-8 md:grid-cols-2 items-center">
          <div>
            <h2 className="font-display text-3xl md:text-5xl text-secondary">Quick questions?</h2>
            <p className="font-mono text-background/80 mt-3 max-w-md">
              Most answers about pricing, applications and verification are already on our pricing page.
            </p>
          </div>
          <div className="md:justify-self-end">
            <BrutalButton asChild variant="yellow">
              <a href="/pricing">See Pricing & FAQs</a>
            </BrutalButton>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Contact;
