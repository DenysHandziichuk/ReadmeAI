"use client";

import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

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

  // 🔹 Load branches on mount
  useEffect(() => {
    loadBranches();
  }, []);

  async function loadBranches() {
    try {
      const res = await fetch("/api/github/branches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner, repo }),
      });

      if (!res.ok) throw new Error("Failed to load branches");

      const data = await res.json();

      console.log("Branches loaded:", data.branches);

      setBranches(data.branches || []);
      setSelectedBranch(data.branches?.[0] || "");
    } catch (err) {
      console.error("Branch load failed", err);
      toast.error("Failed to load branches");
    }
  }

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

      toast.success("README generated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate README");
    } finally {
      setLoading(false);
    }
  }

  async function commitReadme() {
    if (!readme || !selectedBranch) return;

    try {
      const res = await fetch("/api/github/commit-readme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner,
          repo,
          branch: selectedBranch,
          content: readme,
          message: "Add generated README",
        }),
      });

      if (!res.ok) throw new Error();

      toast.success("README committed to GitHub");
    } catch (err) {
      console.error(err);
      toast.error("Failed to commit README");
    }
  }

  async function copyToClipboard() {
    if (!readme) return;

    try {
      await navigator.clipboard.writeText(readme);
      toast.success("README copied to clipboard");
    } catch (err) {
      console.error(err);
      toast.error("Failed to copy README");
    }
  }

  return (
    <main className="p-8 space-y-6">
      <Toaster position="bottom-right" richColors />

      <h1 className="text-2xl font-bold">
        {owner}/{repo}
      </h1>

      <div className="flex flex-wrap gap-4 items-center">
        <button
          onClick={generateReadme}
          disabled={loading}
          className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate README"}
        </button>

        <Link
          href="/dashboard"
          className="px-4 py-2 bg-black text-white rounded inline-block"
        >
          ← Choose another repository
        </Link>
      </div>

      {readme && (
        <div className="space-y-4">
          <div className="flex gap-4 items-center">
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="border p-2 rounded"
            >
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            <button
              onClick={commitReadme}
              disabled={!selectedBranch}
              className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
            >
              Commit README to GitHub
            </button>

            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-black text-white rounded"
            >
              Copy to clipboard
            </button>
          </div>

          <div className="prose max-w-none border rounded p-6 bg-black text-white">
            <ReactMarkdown>{readme}</ReactMarkdown>
          </div>
        </div>
      )}
    </main>
  );
}
