"use client";

import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageTransition from "@/components/PageTransition";
import { motion } from "framer-motion";

import { setReadme } from "@/lib/store/readmeStore";

export default function RepoClient({
  owner,
  repo,
}: {
  owner: string;
  repo: string;
}) {
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState<string[]>([]);
  const [selectedBranch, setSelectedBranch] = useState("");

  const router = useRouter();

  useEffect(() => {
    async function loadBranches() {
      try {
        const res = await fetch("/api/github/branches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ owner, repo }),
        });

        if (!res.ok) return;

        const data = await res.json();
        setBranches(data.branches || []);
        setSelectedBranch(data.branches?.[0] || "");
      } catch {
        toast.error("Failed to load branches ❌");
      }
    }

    loadBranches();
  }, [owner, repo]);

  async function generateReadme() {
    setLoading(true);

    toast.loading("Generating README...", { id: "gen" });

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ owner, repo }),
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      setReadme({
        owner,
        repo,
        content: data.readme,
      });

      toast.success("README ready 🎉", { id: "gen" });

      router.push("/result");
    } catch {
      toast.error("Generate failed ❌", { id: "gen" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageTransition>
      <main className="min-h-screen bg-black px-6 py-14 pt-24 text-white">
        <Toaster position="bottom-right" richColors />

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-5xl space-y-10"
        >
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight">
              Generate a Premium README
            </h1>

            <p className="max-w-xl text-lg text-zinc-400">
              Readme with badges, install steps, and GitHub commit/PR.
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl"
          >
            <p className="text-sm text-zinc-500">Selected repository</p>

            <h2 className="text-2xl font-semibold">
              {owner}/{repo}
            </h2>

            {branches.length > 0 && (
              <p className="text-sm text-zinc-400">
                Default branch:{" "}
                <span className="font-medium text-white">{selectedBranch}</span>
              </p>
            )}
          </motion.div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              onClick={generateReadme}
              disabled={loading}
              className="flex-1 rounded-2xl bg-white px-6 py-4 text-lg font-semibold text-black transition hover:bg-zinc-200 disabled:opacity-50"
            >
              {loading ? "Generating…" : "✨ Generate README"}
            </motion.button>

            <Link
              href="/dashboard"
              className="rounded-2xl border border-zinc-700 px-6 py-4 text-center font-medium transition hover:bg-zinc-900"
            >
              ← Back
            </Link>
          </div>
        </motion.div>
      </main>
    </PageTransition>
  );
}
