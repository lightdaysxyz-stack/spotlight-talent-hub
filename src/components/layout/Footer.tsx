import { Link } from "react-router-dom";
import { Instagram, Youtube, Twitter } from "lucide-react";

export const Footer = () => (
  <footer className="bg-foreground text-background border-t-[4px] border-foreground mt-20">
    <div className="container py-14 grid gap-10 md:grid-cols-4">
      <div className="md:col-span-2">
        <div className="font-display text-4xl md:text-5xl tracking-tight">
          SPOT<span className="text-secondary">LIGHT</span>
        </div>
        <p className="mt-3 font-mono text-sm text-background/70 max-w-sm">
          Lights. Camera. Hired. India's neo-brutalist hiring stage for models &amp; casting directors.
        </p>
        <p className="mt-6 font-display text-secondary text-lg uppercase tracking-wider tilt-1 inline-block border-[3px] border-secondary px-3 py-1">
          Sapno Ki Duniya Mein Aapka Swagat Hai
        </p>
      </div>
      <div>
        <h4 className="font-display text-secondary text-sm tracking-wider mb-3">Platform</h4>
        <ul className="space-y-2 font-mono text-sm">
          <li><Link to="/roles" className="hover:text-secondary">Open Roles</Link></li>
          <li><Link to="/pricing" className="hover:text-secondary">Pricing</Link></li>
          <li><Link to="/signup" className="hover:text-secondary">Sign Up</Link></li>
          <li><Link to="/login" className="hover:text-secondary">Login</Link></li>
          <li><Link to="/about" className="hover:text-secondary">About</Link></li>
          <li><Link to="/contact" className="hover:text-secondary">Contact</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-display text-secondary text-sm tracking-wider mb-3">Follow</h4>
        <div className="flex gap-3">
          <a href="#" aria-label="Instagram" className="border-[3px] border-secondary p-2 hover:bg-secondary hover:text-foreground"><Instagram size={18} /></a>
          <a href="#" aria-label="YouTube" className="border-[3px] border-secondary p-2 hover:bg-secondary hover:text-foreground"><Youtube size={18} /></a>
          <a href="#" aria-label="Twitter" className="border-[3px] border-secondary p-2 hover:bg-secondary hover:text-foreground"><Twitter size={18} /></a>
        </div>
      </div>
    </div>
    <div className="border-t-2 border-secondary/30">
      <div className="container py-4 flex flex-col md:flex-row items-center justify-between text-xs font-mono text-background/60 gap-2">
        <span>© {new Date().getFullYear()} SPOTLIGHT. All rights, all reels.</span>
        <span className="font-display text-secondary tracking-widest">SITARA · JUNOON · ROSHNI</span>
      </div>
    </div>
  </footer>
);
