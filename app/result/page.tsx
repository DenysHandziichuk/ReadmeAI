"use client";

import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import PageTransition from "@/components/PageTransition";
import MarkdownPreview from "@/components/MarkdownPreview";

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
    <PageTransition>
    <main className="min-h-screen bg-black text-white px-6 py-12 pt-24">
      <motion.div
  initial={{ opacity: 0, y: 25 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="max-w-6xl mx-auto space-y-10"
>

        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold">README Generated ✨</h1>
          <p className="text-zinc-400 mt-2">
            {stored.owner}/{stored.repo}
          </p>
        </div>

        {/* Actions */}
        {/* Actions Bar */}
<motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2 }}
  className="sticky top-6 z-40"
>
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 
                  rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur 
                  px-6 py-4 shadow-lg">

    {/* Left hint */}
    <div>
      <p className="text-sm text-zinc-400">
        Commit directly or open a PR — Readme Generator is ready.
      </p>
      <p className="text-xs text-zinc-600 mt-1">
        Select a branch and publish instantly.
      </p>
    </div>

    {/* Right actions */}
    <ResultActions
      owner={stored.owner}
      repo={stored.repo}
      readme={stored.content}
      branches={branches}
      branch={branch}
      setBranch={setBranch}
    />
  </div>
</motion.div>

        <motion.div
  initial={{ opacity: 0, y: 15 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.15 }}
  className="rounded-xl border border-zinc-800 bg-zinc-950 p-6"
>
  <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
  <MarkdownPreview content={stored.content} />
</div>

</motion.div>


        {/* Back */}
        <Link
          href="/dashboard"
          onClick={() => clearReadme()}
          className="text-sm text-zinc-500 hover:text-white"
        >
          ← Back to repositories
        </Link>
      </motion.div>
    </main>
    </PageTransition>
  );
}
