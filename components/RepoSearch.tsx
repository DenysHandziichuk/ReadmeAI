"use client";

import Link from "next/link";
import { useState } from "react";

import { motion } from "framer-motion";

export default function RepoSearch({ repos }: { repos: any[] }) {
  const [query, setQuery] = useState("");

  const filtered = repos.filter((repo) =>
    repo.name.toLowerCase().includes(query.toLowerCase()),
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
      <div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-3 shadow-lg">
        <span className="text-lg text-zinc-500">⌕</span>

        <input
          placeholder="Search repositories..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
        />
      </div>

      {filtered.length === 0 && (
        <p className="py-10 text-center text-sm text-zinc-500">
          No repositories found for{" "}
          <span className="font-medium text-white">"{query}"</span>
        </p>
      )}

      <motion.div
        key={query}
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-5 sm:grid-cols-2"
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
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-white transition group-hover:text-green-400">
                    {repo.name}
                  </h2>

                  <p className="font-mono text-xs text-zinc-500">
                    {repo.owner}
                  </p>

                  <span
                    className={`mt-2 inline-block rounded-full border px-2 py-1 text-xs ${
                      repo.private
                        ? "border-red-500/30 text-red-400"
                        : "border-green-500/30 text-green-400"
                    }`}
                  >
                    {repo.private ? "🔒 Private" : "🌍 Public"}
                  </span>
                </div>

                <span className="text-xl text-zinc-700 transition group-hover:text-white">
                  →
                </span>
              </div>

              {repo.description && (
                <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-zinc-400">
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
