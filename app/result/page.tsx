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

  useEffect(() => {
    if (!stored) return;

    if (!stored.content) {
      router.replace("/dashboard");
    }
  }, [stored, router]);

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

  if (!stored) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-zinc-500">Loading…</p>
      </main>
    );
  }

  if (!stored.content) return null;

  return (
    <PageTransition>
      <main className="min-h-screen bg-black px-6 py-12 pt-24 text-white">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-6xl space-y-10"
        >
          <div>
            <h1 className="text-4xl font-bold">README Generated ✨</h1>
            <p className="mt-2 text-zinc-400">
              {stored.owner}/{stored.repo}
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="sticky top-6 z-40"
          >
            <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/80 px-6 py-4 shadow-lg backdrop-blur md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-zinc-400">
                  Commit directly or open a PR — Readme Generator is ready.
                </p>
                <p className="mt-1 text-xs text-zinc-600">
                  Select a branch and publish instantly.
                </p>
              </div>

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
