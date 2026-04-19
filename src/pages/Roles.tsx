import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { BrutalCard } from "@/components/brutal/BrutalCard";
import { BrutalBadge } from "@/components/brutal/BrutalBadge";
import { BrutalButton } from "@/components/brutal/BrutalButton";
import { supabase } from "@/integrations/supabase/client";
import { formatINR, daysUntil, ROLE_TYPES, ROLE_TYPE_LABEL, DbRoleType } from "@/lib/format";

interface RoleRow {
  id: string;
  title: string;
  description: string;
  pay_rate: number;
  location: string;
  type: DbRoleType;
  deadline: string | null;
}

const Roles = () => {
  const [q, setQ] = useState("");
  const [type, setType] = useState<DbRoleType | "all">("all");
  const [city, setCity] = useState<string>("all");
  const [rows, setRows] = useState<RoleRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("roles")
        .select("id,title,description,pay_rate,location,type,deadline")
        .eq("is_open", true)
        .order("created_at", { ascending: false });
      setRows((data as RoleRow[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const cities = useMemo(() => Array.from(new Set(rows.map((r) => r.location).filter(Boolean))), [rows]);

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        if (type !== "all" && r.type !== type) return false;
        if (city !== "all" && r.location !== city) return false;
        if (q && !`${r.title} ${r.location}`.toLowerCase().includes(q.toLowerCase())) return false;
        return true;
      }),
    [q, type, city, rows]
  );

  return (
    <SiteLayout>
      <section className="bg-secondary border-b-[4px] border-foreground py-14 grain relative overflow-hidden">
        <div className="container relative">
          <span className="font-mono text-xs uppercase tracking-[0.4em]">Casting Open</span>
          <h1 className="font-display text-6xl md:text-8xl uppercase leading-none mt-3">
            Open <span className="text-primary">Roles</span>
          </h1>
          <p className="mt-4 font-mono max-w-xl">
            Live castings from top studios. Apply directly. No middlemen.
          </p>
        </div>
      </section>

      <section className="container py-10">
        <div className="grid gap-4 md:grid-cols-[1fr_auto_auto] mb-8">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search roles, cities…"
              className="w-full h-14 pl-12 pr-4 bg-background border-[3px] border-foreground brutal-shadow-sm font-mono placeholder:text-foreground/50 focus:outline-none focus:bg-secondary"
            />
          </div>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as DbRoleType | "all")}
            className="h-14 px-4 bg-background border-[3px] border-foreground brutal-shadow-sm font-display uppercase text-sm focus:outline-none focus:bg-secondary"
          >
            <option value="all">All Types</option>
            {ROLE_TYPES.map((t) => (
              <option key={t} value={t}>{ROLE_TYPE_LABEL[t]}</option>
            ))}
          </select>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="h-14 px-4 bg-background border-[3px] border-foreground brutal-shadow-sm font-display uppercase text-sm focus:outline-none focus:bg-secondary"
          >
            <option value="all">All Cities</option>
            {cities.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="font-display text-2xl uppercase animate-pulse">Loading roles…</div>
        ) : filtered.length === 0 ? (
          <BrutalCard tone="white" className="p-10 text-center">
            <div className="font-display text-3xl uppercase">No roles yet</div>
            <p className="font-mono mt-2 text-muted-foreground">
              Keep watching this space — new castings drop daily.
            </p>
          </BrutalCard>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((r) => {
              const days = daysUntil(r.deadline);
              const urgent = days !== null && days <= 3;
              return (
                <BrutalCard key={r.id} tone="white" shadow="default" className="p-6 flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <BrutalBadge tone="black">{ROLE_TYPE_LABEL[r.type]}</BrutalBadge>
                    {days !== null && (
                      <BrutalBadge tone={urgent ? "red" : "yellow"}>
                        {days === 0 ? "Today" : `${days}d left`}
                      </BrutalBadge>
                    )}
                  </div>
                  <h3 className="font-display text-2xl uppercase mt-4 leading-tight">{r.title}</h3>

                  <div className="mt-5 flex items-center justify-between border-t-2 border-dashed border-foreground/30 pt-4">
                    <div>
                      <div className="font-display text-primary text-2xl">{formatINR(r.pay_rate)}</div>
                      <div className="font-mono text-[10px] uppercase tracking-widest opacity-60">per day</div>
                    </div>
                    <div className="text-right">
                      <div className="font-display uppercase">{r.location}</div>
                    </div>
                  </div>

                  <BrutalButton asChild variant="primary" size="md" className="mt-5">
                    <Link to={`/roles/${r.id}`}>View Role →</Link>
                  </BrutalButton>
                </BrutalCard>
              );
            })}
          </div>
        )}
      </section>
    </SiteLayout>
  );
};

export default Roles;
