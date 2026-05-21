"use client";

import { motion } from "framer-motion";

const phrases = [
  "Getting your README ready...",
  "Analyzing your repository...",
  "Crafting the perfect README...",
  "Almost there...",
];

export default function Loading() {
  return (
    <main className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white">
      <div className="relative flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute h-40 w-40 rounded-full border border-green-500/20"
        />
        <motion.div
          animate={{ scale: [1, 1.8, 1], opacity: [0.2, 0, 0.2] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          className="absolute h-40 w-40 rounded-full border border-green-500/10"
        />
        <motion.div
          animate={{ scale: [1, 2.2, 1], opacity: [0.1, 0, 0.1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
          className="absolute h-40 w-40 rounded-full border border-green-500/5"
        />

        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="h-10 w-10 rounded-full border-2 border-zinc-800 border-t-green-500"
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-10 text-center"
      >
        <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-400">
          ReadmeAI
        </h2>
        <div className="mt-3 h-5 overflow-hidden">
          {phrases.map((phrase, i) => (
            <motion.p
              key={i}
              className="text-sm text-zinc-500 italic"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 1.5 + i * 2,
                duration: 0.6,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: phrases.length * 2 - 2,
              }}
            >
              {phrase}
            </motion.p>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
