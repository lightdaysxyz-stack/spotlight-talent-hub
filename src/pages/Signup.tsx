import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { BrutalCard } from "@/components/brutal/BrutalCard";
import { BrutalButton } from "@/components/brutal/BrutalButton";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

type Role = "model" | "director";

const Signup = () => {
  const [role, setRole] = useState<Role>("model");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 6) {
      toast({ title: "Password too short", description: "Use at least 6 characters.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password: pw,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { name, role },
      },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({
      title: "WELCOME TO SPOTLIGHT ★",
      description: `Account created as ${role.toUpperCase()}.`,
    });
    navigate(role === "director" ? "/dashboard/director" : "/dashboard/model", { replace: true });
  };

  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/login",
    });
    if (result.error) {
      toast({ title: "Google sign-in failed", description: String(result.error), variant: "destructive" });
    }
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

          <div className="grid grid-cols-2 gap-0 brutal-border-thick brutal-shadow-sm mb-6">
            {(["model", "director"] as Role[]).map((r, i) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={cn(
                  "py-3 font-display uppercase text-sm tracking-wider transition-colors",
                  i === 0 ? "border-r-[3px] border-foreground" : "",
                  role === r ? "bg-primary text-primary-foreground" : "bg-background hover:bg-secondary/40"
                )}
              >
                {r === "model" ? "I'm a Model" : "Casting Director"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            <Field label="Full Name" value={name} onChange={setName} placeholder="Aanya Kapoor" />
            <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@spotlight.in" />
            <Field label="Password" type="password" value={pw} onChange={setPw} placeholder="min 6 characters" />

            <BrutalButton type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
              {loading ? "Rolling…" : `Sign Up as ${role.toUpperCase()} →`}
            </BrutalButton>

            <div className="relative my-2 text-center">
              <span className="bg-background px-3 font-mono text-xs uppercase tracking-widest relative z-10">or</span>
              <div className="absolute left-0 right-0 top-1/2 h-[3px] bg-foreground -z-0" />
            </div>

            <BrutalButton type="button" variant="outline" size="lg" className="w-full" onClick={google}>
              <span className="text-lg">G</span> Continue with Google
            </BrutalButton>
            <p className="font-mono text-[11px] opacity-60 text-center">
              Google signups default to MODEL role. Switch in your dashboard.
            </p>
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
  label, type = "text", value, onChange, placeholder,
}: { label: string; type?: string; value: string; onChange: (v: string) => void; placeholder?: string; }) => (
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
