"use client";

import Link from "next/link";
import { useState } from "react";

import { motion } from "framer-motion";

export default function RepoSearch({ repos }: { repos: any[] }) {
  const [query, setQuery] = useState("");

  const filtered = repos.filter((repo) =>
    repo.name.toLowerCase().includes(query.toLowerCase())
  );

  /* ✅ Animation Variants */
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const card = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-8">

      <div className="flex items-center gap-3 border border-zinc-800 bg-zinc-950 rounded-2xl px-5 py-3 shadow-lg">
        <span className="text-zinc-500 text-lg">⌕</span>

        <input
          placeholder="Search repositories..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent outline-none text-white placeholder:text-zinc-600 text-sm"
        />
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-zinc-500 text-sm py-10">
          No repositories found for{" "}
          <span className="text-white font-medium">
            "{query}"
          </span>
        </p>
      )}

      <motion.div
        key={query}
        variants={container}
        initial="hidden"
        animate="show"
        className="grid sm:grid-cols-2 gap-5"
      >
        {filtered.map((repo) => (
          <motion.div
            key={`${repo.owner}/${repo.name}`}
            variants={card}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 250 }}
          >
            <Link
              href={`/dashboard/${repo.owner}/${repo.name}`}
              className="group block rounded-2xl border border-zinc-800 bg-zinc-950 p-6 transition-all hover:bg-zinc-900 hover:shadow-xl"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-white group-hover:text-green-400 transition">
                    {repo.name}
                  </h2>

                  <p className="text-xs text-zinc-500 font-mono">
                    {repo.owner}
                  </p>

                  <span
                    className={`inline-block mt-2 text-xs px-2 py-1 rounded-full border ${
                      repo.private
                        ? "border-red-500/30 text-red-400"
                        : "border-green-500/30 text-green-400"
                    }`}
                  >
                    {repo.private ? "🔒 Private" : "🌍 Public"}
                  </span>
                </div>

                <span className="text-zinc-700 group-hover:text-white transition text-xl">
                  →
                </span>
              </div>

              {repo.description && (
                <p className="mt-4 text-sm text-zinc-400 leading-relaxed line-clamp-2">
                  {repo.description}
                </p>
              )}
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
