import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Camera, FileVideo, Award, Loader2 } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { BrutalCard } from "@/components/brutal/BrutalCard";
import { BrutalButton } from "@/components/brutal/BrutalButton";
import { BrutalBadge } from "@/components/brutal/BrutalBadge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatINR, ROLE_TYPE_LABEL } from "@/lib/format";

interface ProfileRow {
  id: string;
  user_id: string;
  name: string;
  bio: string | null;
  photo_url: string | null;
  height_cm: number | null;
  age: number | null;
  city: string | null;
  portfolio_url: string | null;
  is_pro: boolean;
  is_featured: boolean;
}

interface ApplicationRow {
  id: string;
  status: "pending" | "shortlisted" | "rejected" | "selected";
  created_at: string;
  cover_note: string | null;
  roles: { id: string; title: string; type: string; pay_rate: number; location: string } | null;
}

const ModelDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [apps, setApps] = useState<ApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    if (!user) return;
    const [{ data: p }, { data: a }] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
      supabase
        .from("applications")
        .select("id,status,created_at,cover_note,roles(id,title,type,pay_rate,location)")
        .eq("model_id", user.id)
        .order("created_at", { ascending: false }),
    ]);
    setProfile(p as ProfileRow | null);
    setApps((a as unknown as ApplicationRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const updateProfile = (patch: Partial<ProfileRow>) => {
    setProfile((p) => (p ? { ...p, ...patch } : p));
  };

  const save = async () => {
    if (!profile || !user) return;
    setSaving(true);
    const completion = computeCompletion(profile);
    const shouldFeature = completion === 100;
    const { error } = await supabase
      .from("profiles")
      .update({
        name: profile.name,
        bio: profile.bio,
        height_cm: profile.height_cm,
        age: profile.age,
        city: profile.city,
        portfolio_url: profile.portfolio_url,
        is_featured: shouldFeature || profile.is_featured,
      })
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "PROFILE SAVED ★", description: "Your sitara shine is locked in." });
    load();
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Too large", description: "Max 5MB photo.", variant: "destructive" });
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (upErr) {
      setUploading(false);
      toast({ title: "Upload failed", description: upErr.message, variant: "destructive" });
      return;
    }
    const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
    await supabase.from("profiles").update({ photo_url: pub.publicUrl }).eq("user_id", user.id);
    setUploading(false);
    load();
    toast({ title: "Photo updated ★" });
  };

  if (loading || !profile) {
    return (
      <SiteLayout>
        <div className="container py-32 text-center font-display text-2xl uppercase animate-pulse">Loading dashboard…</div>
      </SiteLayout>
    );
  }

  const completion = computeCompletion(profile);

  return (
    <SiteLayout>
      <section className="bg-foreground text-background border-b-[4px] border-foreground py-10">
        <div className="container flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.4em] text-secondary">— Model Dashboard —</span>
            <h1 className="font-display text-5xl md:text-6xl uppercase mt-2">
              Hello, <span className="text-primary">{profile.name || "Sitara"}</span>
            </h1>
          </div>
          {profile.is_featured && (
            <BrutalBadge tone="yellow" tilt className="text-base px-4 py-2">
              <Award size={16} /> FEATURED SITARA
            </BrutalBadge>
          )}
        </div>
      </section>

      <section className="container py-10 grid lg:grid-cols-[360px_1fr] gap-8">
        {/* LEFT — profile */}
        <div className="space-y-6">
          <BrutalCard tone="white" shadow="default" className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative w-32 h-32 border-[4px] border-foreground brutal-shadow-sm bg-secondary mb-4 overflow-hidden">
                {profile.photo_url ? (
                  <img src={profile.photo_url} alt="profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full grid place-items-center font-display text-4xl">★</div>
                )}
                <label className="absolute bottom-0 right-0 w-9 h-9 bg-primary text-primary-foreground border-[3px] border-foreground grid place-items-center cursor-pointer">
                  {uploading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
                  <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
                </label>
              </div>
              <div className="font-display uppercase">{profile.name || "Unnamed"}</div>
              <div className="font-mono text-xs opacity-60">{profile.city || "Location?"}</div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between font-display text-xs uppercase mb-2">
                <span>Profile Complete</span>
                <span className="text-primary">{completion}%</span>
              </div>
              <div className="h-4 border-[3px] border-foreground bg-background overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{
                    width: `${completion}%`,
                    backgroundImage:
                      "repeating-linear-gradient(45deg, hsl(var(--primary)) 0 6px, hsl(var(--accent)) 6px 12px)",
                  }}
                />
              </div>
              {completion < 100 && (
                <p className="font-mono text-[11px] mt-2 opacity-70">
                  Reach 100% to unlock the Featured Sitara badge.
                </p>
              )}
            </div>
          </BrutalCard>

          <BrutalCard tone="yellow" shadow="default" className="p-6">
            <div className="font-display uppercase text-sm mb-2">Quick Links</div>
            <div className="flex flex-col gap-2">
              <BrutalButton asChild variant="black" size="sm">
                <Link to="/roles">Browse Open Roles →</Link>
              </BrutalButton>
              <BrutalButton asChild variant="outline" size="sm">
                <Link to="/pricing">Upgrade to PRO ★</Link>
              </BrutalButton>
            </div>
          </BrutalCard>
        </div>

        {/* RIGHT */}
        <div className="space-y-8">
          <BrutalCard tone="white" shadow="default" className="p-6">
            <h2 className="font-display text-2xl uppercase mb-4">My Profile</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Name" value={profile.name} onChange={(v) => updateProfile({ name: v })} />
              <Field label="City" value={profile.city ?? ""} onChange={(v) => updateProfile({ city: v })} />
              <Field label="Height (cm)" type="number" value={profile.height_cm?.toString() ?? ""} onChange={(v) => updateProfile({ height_cm: v ? parseInt(v) : null })} />
              <Field label="Age" type="number" value={profile.age?.toString() ?? ""} onChange={(v) => updateProfile({ age: v ? parseInt(v) : null })} />
              <Field label="Portfolio URL" value={profile.portfolio_url ?? ""} onChange={(v) => updateProfile({ portfolio_url: v })} className="sm:col-span-2" />
              <label className="block sm:col-span-2">
                <div className="font-display uppercase text-xs mb-2">Bio</div>
                <textarea
                  rows={4}
                  value={profile.bio ?? ""}
                  maxLength={500}
                  onChange={(e) => updateProfile({ bio: e.target.value })}
                  placeholder="Tell casting directors about yourself…"
                  className="w-full p-3 bg-background border-[3px] border-foreground font-mono text-sm focus:outline-none focus:bg-secondary/40"
                />
              </label>
            </div>
            <BrutalButton variant="primary" size="lg" className="mt-5" onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save Profile"}
            </BrutalButton>
          </BrutalCard>

          <BrutalCard tone="white" shadow="default" className="p-6">
            <h2 className="font-display text-2xl uppercase mb-4 flex items-center gap-2">
              <FileVideo size={22} /> My Applications
            </h2>
            {apps.length === 0 ? (
              <div className="text-center py-10 font-mono opacity-70">
                No applications yet — <Link to="/roles" className="underline decoration-primary">browse roles</Link>.
              </div>
            ) : (
              <div className="space-y-3">
                {apps.map((a) => (
                  <div key={a.id} className="border-[3px] border-foreground p-4 flex items-center justify-between gap-4 bg-background">
                    <div className="min-w-0">
                      <div className="font-display uppercase truncate">{a.roles?.title ?? "Role removed"}</div>
                      <div className="font-mono text-xs opacity-60">
                        {a.roles && `${ROLE_TYPE_LABEL[a.roles.type]} · ${a.roles.location} · ${formatINR(a.roles.pay_rate)}/day`}
                      </div>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>
                ))}
              </div>
            )}
          </BrutalCard>
        </div>
      </section>
    </SiteLayout>
  );
};

const StatusBadge = ({ status }: { status: ApplicationRow["status"] }) => {
  const map: Record<ApplicationRow["status"], { tone: any; label: string }> = {
    pending: { tone: "yellow", label: "Pending" },
    shortlisted: { tone: "saffron", label: "Shortlisted" },
    rejected: { tone: "red", label: "Rejected" },
    selected: { tone: "green", label: "Selected ★" },
  };
  const { tone, label } = map[status];
  return <BrutalBadge tone={tone}>{label}</BrutalBadge>;
};

const Field = ({
  label, type = "text", value, onChange, className = "",
}: { label: string; type?: string; value: string; onChange: (v: string) => void; className?: string; }) => (
  <label className={`block ${className}`}>
    <div className="font-display uppercase text-xs mb-2">{label}</div>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-11 px-3 bg-background border-[3px] border-foreground font-mono text-sm focus:outline-none focus:bg-secondary/40"
    />
  </label>
);

const computeCompletion = (p: ProfileRow): number => {
  const fields = [p.name, p.bio, p.photo_url, p.city, p.portfolio_url, p.height_cm, p.age];
  const filled = fields.filter((f) => f !== null && f !== undefined && f !== "" && f !== 0).length;
  return Math.round((filled / fields.length) * 100);
};

export default ModelDashboard;
