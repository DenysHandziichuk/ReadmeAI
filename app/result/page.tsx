"use client";

import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useStoredReadme, clearReadme } from "@/lib/store/readmeStore";
import ResultActions from "@/components/ResultActions";

export default function ResultPage() {
  const router = useRouter();
  const stored = useStoredReadme();

  const [branches, setBranches] = useState<string[]>([]);
  const [branch, setBranch] = useState("");

  /* ✅ Redirect if nothing stored */
  useEffect(() => {
    if (!stored) return;

    if (!stored.content) {
      router.replace("/dashboard");
    }
  }, [stored, router]);

  /* ✅ Load branches */
  useEffect(() => {
    if (!stored) return;
    if (!stored.owner || !stored.repo) return;

    async function loadBranches() {
      try {
        const res = await fetch("/api/github/branches", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            owner: stored?.owner,
            repo: stored?.repo,
          }),
        });

        if (!res.ok) throw new Error("Branches failed");

        const json = await res.json();

        setBranches(json.branches || []);
        setBranch(json.branches?.[0] || "");
      } catch (err) {
        console.error(err);
      }
    }

    loadBranches();
  }, [stored]);

  /* ✅ Loading UI */
  if (!stored) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-500">Loading…</p>
      </main>
    );
  }

  if (!stored.content) return null;

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold">README Generated ✨</h1>
          <p className="text-zinc-400 mt-2">
            {stored.owner}/{stored.repo}
          </p>
        </div>

        {/* Actions */}
        <ResultActions
          owner={stored.owner}
          repo={stored.repo}
          readme={stored.content}
          branches={branches}
          branch={branch}
          setBranch={setBranch}
        />

        {/* Preview */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown>{stored.content}</ReactMarkdown>
          </div>
        </div>

        {/* Back */}
        <Link
          href="/dashboard"
          onClick={() => clearReadme()}
          className="text-sm text-zinc-500 hover:text-white"
        >
          ← Back to repositories
        </Link>
      </div>
    </main>
  );
}
