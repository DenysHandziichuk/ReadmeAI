"use client";

import Link from "next/link";
import { useState } from "react";

export default function RepoSearch({ repos }: { repos: any[] }) {
  const [query, setQuery] = useState("");

  const filtered = repos.filter((repo) =>
    repo.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="flex items-center gap-3 border border-zinc-800 bg-zinc-950 rounded-2xl px-5 py-3">
        <span className="text-zinc-500">⌕</span>

        <input
          placeholder="Search repositories..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent outline-none text-white placeholder:text-zinc-600"
        />
      </div>

      {/* Repo cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map((repo) => (
          <Link
            key={`${repo.owner}/${repo.name}`}
            href={`/dashboard/${repo.owner}/${repo.name}`}
            className="group rounded-2xl border border-zinc-800 bg-zinc-950 p-6 hover:bg-zinc-900 transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold group-hover:text-white">
                  {repo.name}
                </h2>

                <p className="text-sm text-zinc-500 mt-1">
                  {repo.private ? "🔒 Private" : "🌍 Public"}
                </p>
              </div>

              <span className="text-zinc-700 group-hover:text-white transition">
                →
              </span>
            </div>

            {repo.description && (
              <p className="mt-4 text-sm text-zinc-400 line-clamp-2">
                {repo.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
