"use client";

import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

import ResultActions from "@/components/ResultActions";

export default function RepoClient({
  owner,
  repo,
}: {
  owner: string;
  repo: string;
}) {
  const [readme, setReadme] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [branches, setBranches] = useState<string[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>("");

  /* ✅ Load branches once */
  useEffect(() => {
    async function loadBranches() {
      try {
        const res = await fetch("/api/github/branches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ owner, repo }),
        });

        if (!res.ok) throw new Error("Failed to load branches");

        const data = await res.json();

        setBranches(data.branches || []);
        setSelectedBranch(data.branches?.[0] || "");
      } catch (err) {
        console.error(err);
        toast.error("Failed to load branches");
      }
    }

    loadBranches();
  }, [owner, repo]);

  /* ✅ Generate README */
  async function generateReadme() {
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner, repo }),
      });

      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();
      setReadme(data.readme);

      toast.success("README generated 🎉");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate README");
    } finally {
      setLoading(false);
    }
  }

  /* ✅ Copy */
  async function copyToClipboard() {
    if (!readme) return;

    try {
      await navigator.clipboard.writeText(readme);
      toast.success("README copied 📋");
    } catch (err) {
      console.error(err);
      toast.error("Copy failed");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white px-8 py-12">
      <Toaster position="bottom-right" richColors />

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">
            {owner}/{repo}
          </h1>

          <p className="text-zinc-400">
            Generate a Mode B product-style README with badges, clean structure,
            and GitHub-ready formatting.
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={generateReadme}
            disabled={loading}
            className="px-5 py-3 bg-white text-black rounded-xl font-semibold hover:bg-zinc-200 transition disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate README"}
          </button>

          <Link
            href="/dashboard"
            className="px-5 py-3 border border-zinc-700 rounded-xl hover:bg-zinc-900 transition"
          >
            ← Back to Repositories
          </Link>
        </div>

        {/* README Output */}
        {readme && (
          <div className="space-y-6 pt-6">
            {/* Controls */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Branch Selector */}
              <select
                value={selectedBranch}
                disabled={branches.length === 0}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="bg-zinc-900 border border-zinc-700 px-3 py-2 rounded-lg text-white disabled:opacity-50"
              >
                {branches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>

              {/* ✅ Commit / PR Split Button */}
              <ResultActions
                owner={owner}
                repo={repo}
                readme={readme}
              />

              {/* Copy */}
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 border border-zinc-700 rounded-lg hover:bg-zinc-900 transition"
              >
                Copy Markdown
              </button>
            </div>

            {/* Preview */}
            <div className="prose prose-invert max-w-none border border-zinc-800 rounded-xl p-6 bg-zinc-950">
              <ReactMarkdown>{readme}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
