import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { BrutalButton } from "@/components/brutal/BrutalButton";

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/roles", label: "Open Roles" },
    { to: "/pricing", label: "Pricing" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background border-b-[4px] border-foreground">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="inline-block w-9 h-9 bg-secondary border-[3px] border-foreground brutal-shadow-sm grid place-items-center font-display text-xl">★</span>
          <span className="font-display text-2xl md:text-3xl tracking-tight">
            SPOT<span className="text-primary">LIGHT</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `font-display uppercase text-sm tracking-wider relative pb-1 ${
                  isActive
                    ? "text-foreground after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-1 after:bg-primary"
                    : "text-foreground/70 hover:text-foreground"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <BrutalButton asChild variant="outline" size="sm">
            <Link to="/login">Login</Link>
          </BrutalButton>
          <BrutalButton asChild variant="primary" size="sm">
            <Link to="/signup">Get Started</Link>
          </BrutalButton>
        </div>

        <button
          className="md:hidden border-[3px] border-foreground p-2 bg-secondary"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t-[3px] border-foreground bg-background">
          <div className="container py-4 flex flex-col gap-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="font-display uppercase text-base py-2 border-b-2 border-foreground/10"
              >
                {l.label}
              </Link>
            ))}
            <div className="flex gap-3 pt-2">
              <BrutalButton asChild variant="outline" size="sm" className="flex-1">
                <Link to="/login">Login</Link>
              </BrutalButton>
              <BrutalButton asChild variant="primary" size="sm" className="flex-1">
                <Link to="/signup">Get Started</Link>
              </BrutalButton>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
