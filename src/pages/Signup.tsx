import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { BrutalCard } from "@/components/brutal/BrutalCard";
import { BrutalButton } from "@/components/brutal/BrutalButton";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Role = "MODEL" | "DIRECTOR";

const Signup = () => {
  const [role, setRole] = useState<Role>("MODEL");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "WELCOME TO SPOTLIGHT ★",
        description: `Account ready for ${role}. Connect Lovable Cloud to persist this.`,
      });
      navigate("/");
    }, 700);
  };

  return (
    <SiteLayout>
      <section className="container py-12 md:py-16 grid lg:grid-cols-[1fr_1fr] gap-10 items-start">
        <div className="hidden lg:block sticky top-28">
          <span className="font-mono text-xs uppercase tracking-[0.4em] text-primary">— Step Up —</span>
          <h1 className="font-display text-7xl uppercase leading-[0.9] mt-3">
            Light. <br />
            <span className="text-primary">Camera.</span> <br />
            <span className="text-accent">Apply.</span>
          </h1>
          <p className="mt-6 font-mono max-w-sm">
            One free account. Pick your side of the camera. The stage is yours.
          </p>
          <div className="mt-10 stripes-pink-black h-32 brutal-border-thick brutal-shadow tilt-1" />
        </div>

        <BrutalCard tone="white" shadow="default" className="p-8 max-w-xl w-full">
          <h2 className="font-display text-3xl uppercase">Create Account</h2>
          <p className="font-mono text-sm opacity-70 mt-1 mb-6">
            Sapno Ki Duniya Mein Aapka Swagat Hai.
          </p>

          {/* Role toggle */}
          <div className="grid grid-cols-2 gap-0 brutal-border-thick brutal-shadow-sm mb-6">
            {(["MODEL", "DIRECTOR"] as Role[]).map((r, i) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={cn(
                  "py-3 font-display uppercase text-sm tracking-wider transition-colors",
                  i === 0 ? "border-r-[3px] border-foreground" : "",
                  role === r
                    ? "bg-primary text-primary-foreground"
                    : "bg-background hover:bg-secondary/40"
                )}
              >
                {r === "MODEL" ? "I'm a Model" : "Casting Director"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            <Field label="Full Name" value={name} onChange={setName} placeholder="Aanya Kapoor" />
            <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@spotlight.in" />
            <Field label="Password" type="password" value={pw} onChange={setPw} placeholder="min 8 characters" />

            <BrutalButton type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
              {loading ? "Rolling…" : `Sign Up as ${role} →`}
            </BrutalButton>

            <div className="relative my-2 text-center">
              <span className="bg-background px-3 font-mono text-xs uppercase tracking-widest relative z-10">or</span>
              <div className="absolute left-0 right-0 top-1/2 h-[3px] bg-foreground -z-0" />
            </div>

            <BrutalButton type="button" variant="outline" size="lg" className="w-full">
              <span className="text-lg">G</span> Continue with Google
            </BrutalButton>
          </form>

          <p className="font-mono text-sm mt-6 text-center">
            Already have an account?{" "}
            <Link to="/login" className="font-display uppercase underline decoration-4 decoration-primary underline-offset-4">
              Login
            </Link>
          </p>
        </BrutalCard>
      </section>
    </SiteLayout>
  );
};

const Field = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) => (
  <label className="block">
    <div className="font-display uppercase text-xs mb-2">{label}</div>
    <input
      type={type}
      required
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-12 px-3 bg-background border-[3px] border-foreground font-mono text-sm focus:outline-none focus:bg-secondary/50"
    />
  </label>
);

export default Signup;
