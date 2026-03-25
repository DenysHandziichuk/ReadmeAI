"use client";

import { motion } from "framer-motion";
import { BADGES_BASE } from "@/lib/readme/generateBadges";

type TechChipsProps = {
  allTech: string[];
  selectedTech: string[];
  onToggle: (tech: string) => void;
};

export default function TechChips({ allTech, selectedTech, onToggle }: TechChipsProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {allTech.map((t) => {
        const isSelected = selectedTech.includes(t);
        const badgePath = BADGES_BASE[t];
        if (!badgePath) return null;

        const badgeUrl = `https://img.shields.io/badge/${badgePath}${badgePath.includes("?") ? "&" : "?"}style=for-the-badge`;

        return (
          <motion.button
            key={t}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
            onClick={() => onToggle(t)}
            className={`group relative overflow-hidden transition-all duration-300 ${
              isSelected
                ? "shadow-[0_0_15px_rgba(34,197,94,0.4)] opacity-100"
                : "grayscale opacity-30 hover:grayscale-0 hover:opacity-70 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
            }`}
          >
            <img 
              src={badgeUrl} 
              alt={t} 
              className="block h-7 pointer-events-none"
            />
            
            <div className={`absolute inset-0 border-2 transition-opacity duration-300 ${
              isSelected ? "border-green-500/30 opacity-100" : "border-red-500/20 opacity-0 group-hover:opacity-100"
            }`} />
          </motion.button>
        );
      })}
    </div>
  );
}
