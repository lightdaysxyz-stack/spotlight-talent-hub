import { BrutalCard } from "@/components/brutal/BrutalCard";
import { BrutalBadge } from "@/components/brutal/BrutalBadge";
import { Link } from "react-router-dom";
import model1 from "@/assets/model-1.jpg";
import model2 from "@/assets/model-2.jpg";
import model3 from "@/assets/model-3.jpg";

const models = [
  { name: "Aanya Kapoor", tag: "Editorial / Ramp", city: "Mumbai", img: model1, featured: true, tilt: "tilt-1" },
  { name: "Rohan Mehta", tag: "Commercial / Bollywood", city: "Delhi", img: model2, featured: false, tilt: "tilt-2" },
  { name: "Zara Sheikh", tag: "Editorial / Print", city: "Bangalore", img: model3, featured: true, tilt: "tilt-neg" },
];

export const FeaturedModels = () => (
  <section className="relative py-20 md:py-28 grid-lines">
    <div className="container">
      <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
        <div>
          <BrutalBadge tone="pink" tilt>★ Filmi Awards Picks</BrutalBadge>
          <h2 className="mt-4 font-display text-5xl md:text-7xl uppercase leading-none">
            Featured <span className="text-primary">Sitare</span>
          </h2>
        </div>
        <Link
          to="/roles"
          className="font-display uppercase text-sm tracking-wider underline decoration-4 decoration-primary underline-offset-4"
        >
          See all talent →
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8 md:gap-10">
        {models.map((m) => (
          <BrutalCard
            key={m.name}
            tone="white"
            shadow="default"
            className={`p-0 ${m.tilt} hover:tilt-2 transition-transform`}
          >
            <div className="relative">
              <img
                src={m.img}
                alt={`Portrait of model ${m.name}`}
                width={800}
                height={1024}
                loading="lazy"
                className="w-full h-[420px] object-cover border-b-[4px] border-foreground"
              />
              {m.featured && (
                <div className="absolute -top-3 -right-3 rotate-12">
                  <BrutalBadge tone="yellow">★ FILMI PICK</BrutalBadge>
                </div>
              )}
            </div>
            <div className="p-5 flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl uppercase">{m.name}</h3>
                <p className="font-mono text-xs text-muted-foreground mt-1">
                  {m.tag} · {m.city}
                </p>
              </div>
              <span className="font-display text-3xl text-primary">★</span>
            </div>
          </BrutalCard>
        ))}
      </div>
    </div>
  </section>
);
