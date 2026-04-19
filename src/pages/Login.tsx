import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { BrutalCard } from "@/components/brutal/BrutalCard";
import { BrutalButton } from "@/components/brutal/BrutalButton";
import { BrutalBadge } from "@/components/brutal/BrutalBadge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

const Login = () => {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;

  const redirectByRole = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();
    const target =
      from ||
      (data?.role === "director" ? "/dashboard/director" : "/dashboard/model");
    navigate(target, { replace: true });
  };

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password: pw });
    setLoading(false);
    if (err) {
      setError(true);
      toast({
        title: "ACCESS DENIED",
        description: err.message,
        variant: "destructive",
      });
      return;
    }
    toast({ title: "WELCOME BACK ★", description: "Spotlight is on you." });
    await redirectByRole();
  };

  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/login",
    });
    if (result.error) {
      toast({ title: "Google sign-in failed", description: String(result.error), variant: "destructive" });
      return;
    }
    if (result.redirected) return;
    await redirectByRole();
  };

  return (
    <SiteLayout>
      <section className="relative min-h-[calc(100vh-180px)] grid lg:grid-cols-2">
        <div className="hidden lg:block relative stripes-yellow-black">
          <div className="absolute inset-0 grain" />
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <BrutalBadge tone="pink" tilt>★ Returning Sitara</BrutalBadge>
              <h2 className="mt-6 font-display text-7xl uppercase text-background drop-shadow-[6px_6px_0_hsl(var(--foreground))]">
                Welcome<br />Back.
              </h2>
              <p className="mt-6 font-display text-secondary text-xl tilt-1">JUNOON never sleeps.</p>
            </div>
          </div>
        </div>

        <div className="grid place-items-center p-6 md:p-12 bg-background">
          <BrutalCard tone="white" shadow="default" className="w-full max-w-md p-8">
            <h1 className="font-display text-4xl uppercase">Login</h1>
            <p className="font-mono text-sm opacity-70 mt-1 mb-6">
              Step back into the spotlight.
            </p>

            <form onSubmit={handle} className={`space-y-4 ${error ? "animate-shake" : ""}`}>
              <Field label="Email" type="email" value={email} onChange={setEmail} error={error} placeholder="you@spotlight.in" />
              <Field label="Password" type="password" value={pw} onChange={setPw} error={error} />
              <BrutalButton type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
                {loading ? "Loading…" : "Enter Stage →"}
              </BrutalButton>

              <div className="relative my-2 text-center">
                <span className="bg-background px-3 font-mono text-xs uppercase tracking-widest relative z-10">or</span>
                <div className="absolute left-0 right-0 top-1/2 h-[3px] bg-foreground -z-0" />
              </div>

              <BrutalButton type="button" variant="outline" size="lg" className="w-full" onClick={google}>
                <span className="text-lg">G</span> Continue with Google
              </BrutalButton>
            </form>

            <p className="font-mono text-sm mt-6 text-center">
              No account?{" "}
              <Link to="/signup" className="font-display uppercase underline decoration-4 decoration-primary underline-offset-4">
                Sign Up
              </Link>
            </p>
          </BrutalCard>
        </div>
      </section>
    </SiteLayout>
  );
};

const Field = ({
  label, type, value, onChange, error, placeholder,
}: { label: string; type: string; value: string; onChange: (v: string) => void; error?: boolean; placeholder?: string; }) => (
  <label className="block">
    <div className="font-display uppercase text-xs mb-2">{label}</div>
    <input
      type={type}
      required
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full h-12 px-3 bg-background border-[3px] font-mono text-sm focus:outline-none focus:bg-secondary/50 ${error ? "border-destructive" : "border-foreground"}`}
    />
  </label>
);

export default Login;
