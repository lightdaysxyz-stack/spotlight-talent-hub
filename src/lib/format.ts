export const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export const daysUntil = (iso: string | null) => {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
};

export const ROLE_TYPE_LABEL: Record<string, string> = {
  commercial: "Commercial",
  editorial: "Editorial",
  bollywood: "Bollywood",
  ramp: "Ramp",
};

export const ROLE_TYPES = ["commercial", "editorial", "bollywood", "ramp"] as const;
export type DbRoleType = (typeof ROLE_TYPES)[number];
