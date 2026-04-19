import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Users, Briefcase, Trophy, X } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { BrutalCard } from "@/components/brutal/BrutalCard";
import { BrutalButton } from "@/components/brutal/BrutalButton";
import { BrutalBadge } from "@/components/brutal/BrutalBadge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatINR, ROLE_TYPES, ROLE_TYPE_LABEL, DbRoleType } from "@/lib/format";

interface RoleRow {
  id: string;
  title: string;
  description: string;
  pay_rate: number;
  location: string;
  type: DbRoleType;
  deadline: string | null;
  is_open: boolean;
  created_at: string;
}

interface AppRow {
  id: string;
  status: "pending" | "shortlisted" | "rejected" | "selected";
  cover_note: string | null;
  portfolio_link: string | null;
  video_url: string | null;
  model_id: string;
  role_id: string;
  profile?: { name: string; photo_url: string | null; city: string | null } | null;
}

const DirectorDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [apps, setApps] = useState<AppRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [openAppId, setOpenAppId] = useState<string | null>(null);

  const load = async () => {
    if (!user) return;
    const { data: r } = await supabase
      .from("roles")
      .select("*")
      .eq("director_id", user.id)
      .order("created_at", { ascending: false });
    const rows = (r as RoleRow[]) ?? [];
    setRoles(rows);

    if (rows.length) {
      const { data: a } = await supabase
        .from("applications")
        .select("id,status,cover_note,portfolio_link,video_url,model_id,role_id")
        .in("role_id", rows.map((x) => x.id));
      const appsArr = (a as AppRow[]) ?? [];

      // Hydrate model profile data
      if (appsArr.length) {
        const modelIds = Array.from(new Set(appsArr.map((x) => x.model_id)));
        const { data: profs } = await supabase
          .from("profiles")
          .select("user_id,name,photo_url,city")
          .in("user_id", modelIds);
        const map = new Map((profs ?? []).map((p: any) => [p.user_id, p]));
        appsArr.forEach((ap) => {
          ap.profile = map.get(ap.model_id) ?? null;
        });
      }
      setApps(appsArr);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const updateAppStatus = async (id: string, status: AppRow["status"]) => {
    const { error } = await supabase.from("applications").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    toast({ title: "Status updated ★" });
  };

  const visibleApps = selectedRole ? apps.filter((a) => a.role_id === selectedRole) : apps;
  const stats = {
    rolesPosted: roles.length,
    applicants: apps.length,
    hired: apps.filter((a) => a.status === "selected").length,
  };

  if (loading) {
    return (
      <SiteLayout>
        <div className="container py-32 text-center font-display text-2xl uppercase animate-pulse">Loading dashboard…</div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="bg-foreground text-background border-b-[4px] border-foreground py-10">
        <div className="container flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.4em] text-secondary">— Director Dashboard —</span>
            <h1 className="font-display text-5xl md:text-6xl uppercase mt-2">
              Cast the <span className="text-primary">Stars</span>
            </h1>
          </div>
          <BrutalButton variant="primary" size="lg" onClick={() => setShowForm(true)}>
            <Plus size={18} /> Post New Role
          </BrutalButton>
        </div>
      </section>

      {/* Stats */}
      <section className="container py-8 grid sm:grid-cols-3 gap-5">
        <StatCard label="Roles Posted" value={stats.rolesPosted} icon={<Briefcase size={22} />} tone="white" />
        <StatCard label="Applicants" value={stats.applicants} icon={<Users size={22} />} tone="yellow" />
        <StatCard label="Hired" value={stats.hired} icon={<Trophy size={22} />} tone="pink" />
      </section>

      <section className="container pb-12 grid lg:grid-cols-[300px_1fr] gap-8">
        {/* My Roles */}
        <div>
          <h2 className="font-display text-2xl uppercase mb-4">My Roles</h2>
          {roles.length === 0 ? (
            <BrutalCard tone="white" className="p-6 text-center font-mono text-sm">
              No roles yet. Post one to start casting.
            </BrutalCard>
          ) : (
            <div className="space-y-3">
              <button
                onClick={() => setSelectedRole(null)}
                className={`w-full text-left p-3 border-[3px] border-foreground font-display uppercase text-sm ${
                  selectedRole === null ? "bg-primary text-primary-foreground brutal-shadow-sm" : "bg-background"
                }`}
              >
                All Applicants ({apps.length})
              </button>
              {roles.map((r) => {
                const count = apps.filter((a) => a.role_id === r.id).length;
                return (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRole(r.id)}
                    className={`w-full text-left p-3 border-[3px] border-foreground ${
                      selectedRole === r.id ? "bg-secondary brutal-shadow-sm" : "bg-background"
                    }`}
                  >
                    <div className="font-display uppercase text-sm leading-tight">{r.title}</div>
                    <div className="font-mono text-[11px] opacity-60 mt-1">
                      {ROLE_TYPE_LABEL[r.type]} · {count} apps
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Applicants */}
        <div>
          <h2 className="font-display text-2xl uppercase mb-4">Applicants</h2>
          {visibleApps.length === 0 ? (
            <BrutalCard tone="white" className="p-10 text-center">
              <div className="font-display text-2xl uppercase">No applicants yet</div>
              <p className="font-mono mt-2 opacity-70">Share your role and watch the talent roll in.</p>
            </BrutalCard>
          ) : (
            <div className="space-y-4">
              {visibleApps.map((a) => {
                const role = roles.find((r) => r.id === a.role_id);
                return (
                  <BrutalCard key={a.id} tone="white" shadow="default" className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 border-[3px] border-foreground bg-secondary overflow-hidden shrink-0">
                        {a.profile?.photo_url ? (
                          <img src={a.profile.photo_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full grid place-items-center font-display text-2xl">★</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="font-display uppercase text-lg">{a.profile?.name || "Anonymous"}</div>
                          <span className="font-mono text-xs opacity-60">{a.profile?.city}</span>
                        </div>
                        <div className="font-mono text-xs opacity-60 mt-1">For: {role?.title}</div>
                        {a.cover_note && (
                          <p className="font-mono text-sm mt-2 line-clamp-2">{a.cover_note}</p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {a.portfolio_link && (
                            <a
                              href={a.portfolio_link}
                              target="_blank"
                              rel="noreferrer"
                              className="font-mono text-xs underline decoration-primary decoration-2"
                            >
                              Portfolio ↗
                            </a>
                          )}
                          {a.video_url && <AuditionLink path={a.video_url} />}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <select
                          value={a.status}
                          onChange={(e) => updateAppStatus(a.id, e.target.value as AppRow["status"])}
                          className="h-9 px-2 bg-background border-[3px] border-foreground font-display uppercase text-xs focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="shortlisted">Shortlist</option>
                          <option value="selected">Select ★</option>
                          <option value="rejected">Reject</option>
                        </select>
                        <StatusBadge status={a.status} />
                      </div>
                    </div>
                  </BrutalCard>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {showForm && <PostRoleModal onClose={() => setShowForm(false)} onCreated={() => { setShowForm(false); load(); }} />}
    </SiteLayout>
  );
};

const StatCard = ({ label, value, icon, tone }: { label: string; value: number; icon: React.ReactNode; tone: "white" | "yellow" | "pink" }) => (
  <BrutalCard tone={tone} shadow="default" className="p-5 flex items-center gap-4">
    <div className="w-12 h-12 border-[3px] border-foreground bg-background grid place-items-center">{icon}</div>
    <div>
      <div className="font-display text-4xl">{value}</div>
      <div className="font-mono text-xs uppercase tracking-widest opacity-70">{label}</div>
    </div>
  </BrutalCard>
);

const StatusBadge = ({ status }: { status: AppRow["status"] }) => {
  const map: Record<AppRow["status"], { tone: any; label: string }> = {
    pending: { tone: "yellow", label: "Pending" },
    shortlisted: { tone: "saffron", label: "Shortlisted" },
    rejected: { tone: "red", label: "Rejected" },
    selected: { tone: "green", label: "Selected" },
  };
  const { tone, label } = map[status];
  return <BrutalBadge tone={tone} className="text-[10px]">{label}</BrutalBadge>;
};

const AuditionLink = ({ path }: { path: string }) => {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    supabase.storage.from("auditions").createSignedUrl(path, 3600).then(({ data }) => {
      if (data?.signedUrl) setUrl(data.signedUrl);
    });
  }, [path]);
  if (!url) return <span className="font-mono text-xs opacity-50">Loading video…</span>;
  return (
    <a href={url} target="_blank" rel="noreferrer" className="font-mono text-xs underline decoration-primary decoration-2">
      Watch Audition ↗
    </a>
  );
};

const PostRoleModal = ({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pay, setPay] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState<DbRoleType>("commercial");
  const [deadline, setDeadline] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("roles").insert({
      director_id: user.id,
      title,
      description,
      pay_rate: parseInt(pay) || 0,
      location,
      type,
      deadline: deadline || null,
    });
    setSaving(false);
    if (error) {
      toast({ title: "Failed to post", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "ROLE LIVE ★", description: "Models can now see and apply." });
    onCreated();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-foreground/70 animate-hard-in overflow-y-auto">
      <BrutalCard tone="white" shadow="lg" className="w-full max-w-xl p-6 relative my-8">
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-10 h-10 bg-foreground text-background border-[3px] border-foreground grid place-items-center"
        >
          <X size={18} />
        </button>
        <h3 className="font-display text-3xl uppercase">Post a Role</h3>
        <p className="font-mono text-sm opacity-70 mt-1 mb-5">Casting kar lo, sitare aa rahe hain.</p>

        <form onSubmit={submit} className="space-y-4">
          <FormField label="Role Title" value={title} onChange={setTitle} required placeholder="Lead Model — Festive Campaign" />
          <FormField label="Pay Rate (₹/day)" type="number" value={pay} onChange={setPay} required placeholder="15000" />
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField label="Location" value={location} onChange={setLocation} required placeholder="Mumbai" />
            <label className="block">
              <div className="font-display uppercase text-xs mb-2">Type</div>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as DbRoleType)}
                className="w-full h-12 px-3 bg-background border-[3px] border-foreground font-mono text-sm focus:outline-none"
              >
                {ROLE_TYPES.map((t) => (
                  <option key={t} value={t}>{ROLE_TYPE_LABEL[t]}</option>
                ))}
              </select>
            </label>
          </div>
          <FormField label="Deadline" type="date" value={deadline} onChange={setDeadline} />
          <label className="block">
            <div className="font-display uppercase text-xs mb-2">Description</div>
            <textarea
              required
              rows={5}
              maxLength={2000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="The brief, shoot dates, vibe, requirements…"
              className="w-full p-3 bg-background border-[3px] border-foreground font-mono text-sm focus:outline-none focus:bg-secondary/40"
            />
          </label>

          <BrutalButton type="submit" variant="primary" size="lg" className="w-full" disabled={saving}>
            {saving ? "Posting…" : "Post Role →"}
          </BrutalButton>
        </form>
      </BrutalCard>
    </div>
  );
};

const FormField = ({
  label, type = "text", value, onChange, placeholder, required,
}: { label: string; type?: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean; }) => (
  <label className="block">
    <div className="font-display uppercase text-xs mb-2">{label}{required && " *"}</div>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full h-12 px-3 bg-background border-[3px] border-foreground font-mono text-sm focus:outline-none focus:bg-secondary/40"
    />
  </label>
);

export default DirectorDashboard;
