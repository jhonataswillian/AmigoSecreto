// Helper to load and sort avatars naturally
const loadAvatars = (modules: Record<string, unknown>) => {
  return Object.keys(modules)
    .sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }),
    )
    .map((key) => modules[key] as string);
};

// Helper to interleave men and women avatars
const loadInterleavedAvatars = (modules: Record<string, unknown>) => {
  const keys = Object.keys(modules);
  const men = keys
    .filter((k) => k.includes("homem"))
    .sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }),
    );
  const women = keys
    .filter((k) => k.includes("mulher"))
    .sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }),
    );

  const interleaved: string[] = [];
  const maxLength = Math.max(men.length, women.length);

  for (let i = 0; i < maxLength; i++) {
    if (men[i]) interleaved.push(modules[men[i]] as string);
    if (women[i]) interleaved.push(modules[women[i]] as string);
  }

  return interleaved;
};

// Dynamic imports
const peopleModules = import.meta.glob(
  "../assets/images/pessoas/*.{png,jpg,jpeg,svg}",
  { eager: true, import: "default" },
);
const peopleAvatars = loadInterleavedAvatars(peopleModules);

const petModules = import.meta.glob(
  "../assets/images/pets/*.{png,jpg,jpeg,svg}",
  { eager: true, import: "default" },
);
const petAvatars = loadAvatars(petModules);

const christmasModules = import.meta.glob(
  "../assets/images/natal/*.{png,jpg,jpeg,svg}",
  { eager: true, import: "default" },
);
const christmasAvatars = loadAvatars(christmasModules);

import type { Frame } from "../types";

export interface AvatarCategory {
  id: string;
  name: string;
  avatars: string[];
}

export const AVATAR_CATEGORIES: AvatarCategory[] = [
  {
    id: "christmas",
    name: "Natal",
    avatars: christmasAvatars,
  },
  {
    id: "cute",
    name: "Pets",
    avatars: petAvatars,
  },
  {
    id: "people",
    name: "Pessoas",
    avatars: peopleAvatars,
  },
];

export const FRAMES: Frame[] = [
  { id: "none", name: "Sem moldura", class: "" },

  // Animadas
  {
    id: "snow-animated",
    name: "Neve Animada",
    class: "",
  },
  {
    id: "rain-animated",
    name: "Chuva",
    class: "",
  },
  {
    id: "wreath-animated",
    name: "Magia Natalina",
    class: "",
  },

  // Natal Clássico
  {
    id: "wreath",
    name: "Guirlanda",
    class:
      "border-4 border-christmas-green ring-4 ring-christmas-red shadow-lg",
  },
  {
    id: "santa",
    name: "Papai Noel",
    class: "border-4 border-red-600 ring-4 ring-white shadow-xl",
  },
  {
    id: "gold",
    name: "Luxo Dourado",
    class:
      "border-4 border-christmas-gold ring-2 ring-yellow-200 shadow-xl shadow-yellow-500/20",
  },
  {
    id: "snow",
    name: "Neve",
    class:
      "border-4 border-white ring-4 ring-blue-100 shadow-lg shadow-blue-200/50",
  },

  // Cores Sólidas Premium
  {
    id: "wine",
    name: "Vinho",
    class: "border-4 border-christmas-wine ring-2 ring-christmas-wine-light",
  },
  {
    id: "green",
    name: "Verde",
    class: "border-4 border-christmas-green ring-2 ring-green-300",
  },
  {
    id: "blue",
    name: "Azul Real",
    class: "border-4 border-blue-800 ring-2 ring-blue-400",
  },
  {
    id: "purple",
    name: "Roxo Místico",
    class: "border-4 border-purple-800 ring-2 ring-purple-400",
  },
  {
    id: "black",
    name: "Black",
    class: "border-4 border-gray-900 ring-2 ring-gray-600",
  },

  // Temáticos
  {
    id: "candy",
    name: "Doce",
    class: "border-4 border-pink-400 ring-4 ring-white border-dashed",
  },
  {
    id: "elf",
    name: "Elfo",
    class: "border-4 border-green-500 ring-4 ring-red-500",
  },
  {
    id: "frozen",
    name: "Congelado",
    class: "border-4 border-cyan-200 ring-4 ring-white bg-cyan-50",
  },
  {
    id: "night",
    name: "Noite Feliz",
    class: "border-4 border-indigo-900 ring-2 ring-yellow-400",
  },

  // Especiais
  {
    id: "glow",
    name: "Neon",
    class:
      "border-2 border-white ring-4 ring-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.7)]",
  },
  {
    id: "rainbow",
    name: "Arco-íris",
    class:
      "border-4 border-transparent bg-linear-to-r from-red-500 via-yellow-500 to-blue-500 p-[2px] ring-2 ring-white",
  },
  {
    id: "vintage",
    name: "Vintage",
    class: "border-8 border-double border-amber-700 ring-1 ring-amber-900",
  },
  {
    id: "minimal",
    name: "Minimalista",
    class: "border border-gray-200 ring-1 ring-gray-100 shadow-sm",
  },
  {
    id: "easter",
    name: "Páscoa",
    class: "border-4 border-pink-300 ring-4 ring-yellow-200",
  },
  {
    id: "love",
    name: "Amor",
    class: "border-4 border-red-400 ring-4 ring-pink-200",
  },
];
