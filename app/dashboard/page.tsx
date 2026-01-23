"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Repo = {
  name: string;
  owner: string;
  private: boolean;
  description: string | null;
};

export default function DashboardPage() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRepos() {
      const res = await fetch("/api/github/repos");
      if (!res.ok) return;

      const data = await res.json();
      setRepos(data.repos);
      setLoading(false);
    }

    loadRepos();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Select a repository</h1>

      {loading && (
        <p className="text-zinc-400">Loading repositories…</p>
      )}

      <div className="space-y-3">
        {repos.map(repo => (
  <Link
    key={`${repo.owner}/${repo.name}`}
    href={`/generate?owner=${repo.owner}&repo=${repo.name}`}
    className="block p-4 rounded-lg border border-zinc-800 hover:bg-zinc-900 transition"
  >
    <div className="font-mono">
      {repo.owner}/{repo.name}
    </div>

    {repo.description && (
      <p className="text-sm text-zinc-400 mt-1">
        {repo.description}
      </p>
    )}
  </Link>
))}
      </div>
    </main>
  );
}
