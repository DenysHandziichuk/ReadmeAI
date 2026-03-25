"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="relative flex items-center justify-center">
        {}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute h-32 w-32 rounded-full border border-green-500/20"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute h-32 w-32 rounded-full border border-green-500/10"
        />
        
        {}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="h-8 w-8 rounded-full border-2 border-zinc-800 border-t-green-500"
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 text-center"
      >
        <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
          Initializing
        </h2>
        <p className="mt-2 text-xs text-zinc-600 italic">Securing your session...</p>
      </motion.div>
    </main>
  );
}
