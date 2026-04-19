import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Upload, X } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { BrutalCard } from "@/components/brutal/BrutalCard";
import { BrutalBadge } from "@/components/brutal/BrutalBadge";
import { BrutalButton } from "@/components/brutal/BrutalButton";
import { getRole } from "@/data/roles";
import { useToast } from "@/hooks/use-toast";

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const RoleDetail = () => {
  const { id } = useParams();
  const role = id ? getRole(id) : undefined;
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [coverNote, setCoverNote] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [fileName, setFileName] = useState("");

  if (!role) {
    return (
      <SiteLayout>
        <div className="container py-32 text-center">
          <h1 className="font-display text-6xl uppercase">Role not found</h1>
          <p className="font-mono mt-4">This casting may have closed. Check back soon.</p>
          <BrutalButton asChild variant="primary" className="mt-8">
            <Link to="/roles">← All Roles</Link>
          </BrutalButton>
        </div>
      </SiteLayout>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setOpen(false);
      setCoverNote("");
      setPortfolio("");
      setFileName("");
      toast({
        title: "AUDITION SUBMITTED ★",
        description: "The casting team will review your submission shortly. JUNOON dikhaya!",
      });
    }, 900);
  };

  return (
    <SiteLayout>
      <section className="container py-10 md:py-14">
        <Link to="/roles" className="inline-flex items-center gap-2 font-display uppercase text-sm mb-6 hover:text-primary">
          <ArrowLeft size={16} /> Back to roles
        </Link>

        <div className="grid lg:grid-cols-[1fr_360px] gap-10">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <BrutalBadge tone="black">{role.type}</BrutalBadge>
              <BrutalBadge tone="yellow">{role.location}</BrutalBadge>
              {role.tags.map((t) => (
                <BrutalBadge key={t} tone="white">{t}</BrutalBadge>
              ))}
            </div>
            <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.95]">
              {role.title}
            </h1>
            <p className="font-mono text-muted-foreground mt-3">{role.studio}</p>

            <div className="mt-10">
              <h2 className="font-display text-2xl uppercase mb-3">The Brief</h2>
              <p className="font-mono leading-relaxed">{role.description}</p>
            </div>

            <div className="mt-10">
              <h2 className="font-display text-2xl uppercase mb-3">Requirements</h2>
              <ul className="space-y-2">
                {role.requirements.map((r) => (
                  <li key={r.label} className="flex items-center gap-3 font-mono">
                    <span className="w-5 h-5 bg-secondary border-[3px] border-foreground inline-block" />
                    <span className="font-display uppercase text-sm w-32">{r.label}</span>
                    <span>{r.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 self-start">
            <BrutalCard tone="white" shadow="pink" className="p-6">
              <div className="font-display text-primary text-4xl">{formatINR(role.pay)}</div>
              <div className="font-mono text-xs uppercase tracking-widest opacity-60 mb-5">per day</div>
              <BrutalButton variant="primary" size="lg" className="w-full" onClick={() => setOpen(true)}>
                Submit Audition
              </BrutalButton>
              <p className="font-mono text-xs mt-4 opacity-70">
                You must be logged in as a MODEL to apply. One submission per role.
              </p>
            </BrutalCard>
          </aside>
        </div>
      </section>

      {/* Audition Modal */}
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-foreground/70 animate-hard-in">
          <BrutalCard tone="white" shadow="lg" className="w-full max-w-lg p-6 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute -top-3 -right-3 w-10 h-10 bg-foreground text-background border-[3px] border-foreground grid place-items-center"
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <h3 className="font-display text-3xl uppercase">Submit Audition</h3>
            <p className="font-mono text-sm opacity-70 mt-1 mb-5">For: {role.title}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <div className="font-display uppercase text-xs mb-2">Audition Video (mp4 / mov, max 100MB)</div>
                <div className="border-[3px] border-dashed border-foreground p-4 bg-secondary/30 flex items-center gap-3">
                  <Upload size={18} />
                  <input
                    type="file"
                    accept="video/mp4,video/quicktime"
                    onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
                    className="font-mono text-sm flex-1 bg-transparent outline-none"
                  />
                </div>
                {fileName && <div className="font-mono text-xs mt-1">★ {fileName}</div>}
              </label>

              <label className="block">
                <div className="font-display uppercase text-xs mb-2">Cover Note</div>
                <textarea
                  required
                  rows={3}
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Why you for this role?"
                  className="w-full p-3 bg-background border-[3px] border-foreground font-mono text-sm focus:outline-none focus:bg-secondary/40"
                />
              </label>

              <label className="block">
                <div className="font-display uppercase text-xs mb-2">Portfolio Link</div>
                <input
                  type="url"
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                  placeholder="https://"
                  className="w-full h-12 px-3 bg-background border-[3px] border-foreground font-mono text-sm focus:outline-none focus:bg-secondary/40"
                />
              </label>

              <BrutalButton type="submit" variant="primary" size="lg" className="w-full" disabled={submitting}>
                {submitting ? "Submitting…" : "Send Audition →"}
              </BrutalButton>
            </form>
          </BrutalCard>
        </div>
      )}
    </SiteLayout>
  );
};

export default RoleDetail;
