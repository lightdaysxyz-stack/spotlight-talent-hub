import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, X } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { BrutalCard } from "@/components/brutal/BrutalCard";
import { BrutalBadge } from "@/components/brutal/BrutalBadge";
import { BrutalButton } from "@/components/brutal/BrutalButton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { formatINR, ROLE_TYPE_LABEL, DbRoleType } from "@/lib/format";

interface RoleRow {
  id: string;
  title: string;
  description: string;
  pay_rate: number;
  location: string;
  type: DbRoleType;
  deadline: string | null;
  requirements: { label: string; value: string }[] | null;
  director_id: string;
}

const RoleDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { user, role: userRole } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<RoleRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [coverNote, setCoverNote] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase
        .from("roles")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      setRole((data as unknown as RoleRow) ?? null);
      setLoading(false);

      if (data && user) {
        const { data: app } = await supabase
          .from("applications")
          .select("id")
          .eq("role_id", id)
          .eq("model_id", user.id)
          .maybeSingle();
        setAlreadyApplied(!!app);
      }
    })();
  }, [id, user]);

  const openModal = () => {
    if (!user) {
      toast({ title: "Login required", description: "Sign in as a model to apply." });
      navigate("/login", { state: { from: `/roles/${id}` } });
      return;
    }
    if (userRole !== "model") {
      toast({ title: "Models only", description: "Casting directors can't apply to roles.", variant: "destructive" });
      return;
    }
    if (alreadyApplied) {
      toast({ title: "Already applied", description: "You've submitted for this role." });
      return;
    }
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !role) return;

    if (file && file.size > 100 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 100MB.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    let videoUrl: string | null = null;

    try {
      if (file) {
        const ext = file.name.split(".").pop();
        const path = `${user.id}/${role.id}-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("auditions")
          .upload(path, file, { upsert: false });
        if (upErr) throw upErr;
        videoUrl = path;
      }

      const { error } = await supabase.from("applications").insert({
        role_id: role.id,
        model_id: user.id,
        video_url: videoUrl,
        cover_note: coverNote,
        portfolio_link: portfolio || null,
      });
      if (error) throw error;

      setOpen(false);
      setCoverNote("");
      setPortfolio("");
      setFile(null);
      setAlreadyApplied(true);
      toast({
        title: "AUDITION SUBMITTED ★",
        description: "The casting team will review shortly. JUNOON dikhaya!",
      });
    } catch (err: any) {
      toast({ title: "Submission failed", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SiteLayout>
        <div className="container py-32 text-center font-display text-2xl uppercase animate-pulse">Loading…</div>
      </SiteLayout>
    );
  }

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

  const requirements = role.requirements ?? [];

  return (
    <SiteLayout>
      <section className="container py-10 md:py-14">
        <Link to="/roles" className="inline-flex items-center gap-2 font-display uppercase text-sm mb-6 hover:text-primary">
          <ArrowLeft size={16} /> Back to roles
        </Link>

        <div className="grid lg:grid-cols-[1fr_360px] gap-10">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <BrutalBadge tone="black">{ROLE_TYPE_LABEL[role.type]}</BrutalBadge>
              <BrutalBadge tone="yellow">{role.location}</BrutalBadge>
            </div>
            <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.95]">{role.title}</h1>

            <div className="mt-10">
              <h2 className="font-display text-2xl uppercase mb-3">The Brief</h2>
              <p className="font-mono leading-relaxed whitespace-pre-line">{role.description}</p>
            </div>

            {requirements.length > 0 && (
              <div className="mt-10">
                <h2 className="font-display text-2xl uppercase mb-3">Requirements</h2>
                <ul className="space-y-2">
                  {requirements.map((r, i) => (
                    <li key={i} className="flex items-center gap-3 font-mono">
                      <span className="w-5 h-5 bg-secondary border-[3px] border-foreground inline-block" />
                      <span className="font-display uppercase text-sm w-32">{r.label}</span>
                      <span>{r.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-28 self-start">
            <BrutalCard tone="white" shadow="pink" className="p-6">
              <div className="font-display text-primary text-4xl">{formatINR(role.pay_rate)}</div>
              <div className="font-mono text-xs uppercase tracking-widest opacity-60 mb-5">per day</div>
              <BrutalButton variant="primary" size="lg" className="w-full" onClick={openModal} disabled={alreadyApplied}>
                {alreadyApplied ? "Already Applied ★" : "Submit Audition"}
              </BrutalButton>
              <p className="font-mono text-xs mt-4 opacity-70">
                You must be logged in as a MODEL to apply. One submission per role.
              </p>
            </BrutalCard>
          </aside>
        </div>
      </section>

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
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    className="font-mono text-sm flex-1 bg-transparent outline-none"
                  />
                </div>
                {file && <div className="font-mono text-xs mt-1">★ {file.name}</div>}
              </label>

              <label className="block">
                <div className="font-display uppercase text-xs mb-2">Cover Note</div>
                <textarea
                  required
                  rows={3}
                  maxLength={1000}
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
