"use client";

import { motion } from "framer-motion";

export default function SkeletonReadme() {
  const items = ["Analyzing Languages", "Detecting Frameworks", "Checking CI/CD", "Generating Premium Content"];
  
  return (
    <div className="w-full space-y-8 py-10">
      <div className="space-y-4">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-12 w-3/4 rounded-lg bg-zinc-800"
        />
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          className="h-4 w-1/2 rounded-lg bg-zinc-800"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {items.map((text, i) => (
          <motion.div
            key={text}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-2"
          >
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{text}</span>
          </motion.div>
        ))}
      </div>

      <div className="space-y-6 text-left">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <motion.div
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
              className="h-6 w-1/4 rounded bg-zinc-800"
            />
            <motion.div
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              className="h-24 w-full rounded-2xl border border-zinc-800/50 bg-zinc-950"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
