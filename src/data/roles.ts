export type RoleType = "Commercial" | "Editorial" | "Bollywood" | "Ramp";

export interface Role {
  id: string;
  title: string;
  studio: string;
  pay: number; // INR per day
  location: string;
  type: RoleType;
  deadline: string; // ISO
  description: string;
  requirements: { label: string; value: string }[];
  tags: string[];
}

const today = new Date();
const addDays = (d: number) => {
  const x = new Date(today);
  x.setDate(x.getDate() + d);
  return x.toISOString();
};

export const ROLES: Role[] = [
  {
    id: "lead-festive-2025",
    title: "Lead Model — Festive Campaign",
    studio: "Manyavar × Junoon Studios",
    pay: 15000,
    location: "Mumbai",
    type: "Commercial",
    deadline: addDays(2),
    description:
      "Lead face for the 2025 festive ethnic-wear campaign. Three-day shoot across Bandra and Film City. Looking for striking screen presence and the ability to take direction at speed.",
    requirements: [
      { label: "Height", value: "5'7\" – 6'1\"" },
      { label: "Age", value: "22 – 32" },
      { label: "Experience", value: "1+ year on-camera" },
    ],
    tags: ["Ethnic", "Print", "Hero shot"],
  },
  {
    id: "vogue-editorial",
    title: "Editorial Cover — Vogue India",
    studio: "Vogue India",
    pay: 25000,
    location: "Delhi",
    type: "Editorial",
    deadline: addDays(7),
    description:
      "Cover story shoot for Vogue India's January issue. Concept: Neo-Bombay brutalism meets monsoon couture. One shoot day plus BTS interview.",
    requirements: [
      { label: "Height", value: "5'9\"+" },
      { label: "Age", value: "20 – 30" },
      { label: "Experience", value: "Editorial portfolio required" },
    ],
    tags: ["Cover", "High Fashion"],
  },
  {
    id: "bollywood-supporting",
    title: "Supporting Role — Untitled Action Feature",
    studio: "Excel Entertainment",
    pay: 50000,
    location: "Mumbai",
    type: "Bollywood",
    deadline: addDays(14),
    description:
      "Speaking supporting role in upcoming action thriller. Six shoot days spread over two months. Stunt training provided.",
    requirements: [
      { label: "Age", value: "25 – 40" },
      { label: "Languages", value: "Hindi, English" },
      { label: "Experience", value: "Acting reel mandatory" },
    ],
    tags: ["Speaking", "Action"],
  },
  {
    id: "lakme-ramp",
    title: "Ramp Walk — Lakmé Fashion Week",
    studio: "Lakmé × FDCI",
    pay: 18000,
    location: "Mumbai",
    type: "Ramp",
    deadline: addDays(1),
    description:
      "Closing show ramp walk for FDCI x Lakmé Fashion Week resort collection. Single day plus rehearsal evening.",
    requirements: [
      { label: "Height", value: "5'10\"+" },
      { label: "Age", value: "18 – 28" },
      { label: "Experience", value: "Ramp experience preferred" },
    ],
    tags: ["Runway", "Couture"],
  },
  {
    id: "ola-commercial",
    title: "Brand Face — Ola Electric TVC",
    studio: "Ola × Lowe Lintas",
    pay: 22000,
    location: "Bangalore",
    type: "Commercial",
    deadline: addDays(5),
    description:
      "Lead in 60-second TVC for Ola Electric's new scooter line. Shoot across Bangalore tech parks and coastal Karnataka.",
    requirements: [
      { label: "Age", value: "24 – 34" },
      { label: "License", value: "Two-wheeler license required" },
    ],
    tags: ["TVC", "Hero face"],
  },
  {
    id: "harper-print",
    title: "Print Editorial — Harper's Bazaar",
    studio: "Harper's Bazaar India",
    pay: 12000,
    location: "Goa",
    type: "Editorial",
    deadline: addDays(10),
    description:
      "Beach editorial spread for monsoon issue. Two-day shoot in North Goa.",
    requirements: [
      { label: "Height", value: "5'8\"+" },
      { label: "Age", value: "20 – 30" },
    ],
    tags: ["Beach", "Monsoon"],
  },
];

export const getRole = (id: string) => ROLES.find((r) => r.id === id);

export const ROLE_TYPES: RoleType[] = ["Commercial", "Editorial", "Bollywood", "Ramp"];
export const LOCATIONS = ["Mumbai", "Delhi", "Bangalore", "Goa"];
