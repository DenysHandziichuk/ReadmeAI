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

  /* ✅ Load branches */
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

  /* ✅ Generate README */
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
    <main className="pt-24 min-h-screen bg-black text-white px-6 py-14">
      <Toaster position="bottom-right" richColors />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-5xl mx-auto space-y-10"
      >
        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">
            Generate a Premium README
          </h1>

          <p className="text-zinc-400 text-lg max-w-xl">
            Readme with badges, install steps, and GitHub commit/PR.
          </p>
        </div>

        {/* Repo Card */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl space-y-3"
        >
          <p className="text-sm text-zinc-500">Selected repository</p>

          <h2 className="text-2xl font-semibold">
            {owner}/{repo}
          </h2>

          {branches.length > 0 && (
            <p className="text-sm text-zinc-400">
              Default branch:{" "}
              <span className="text-white font-medium">
                {selectedBranch}
              </span>
            </p>
          )}
        </motion.div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4">
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            onClick={generateReadme}
            disabled={loading}
            className="flex-1 px-6 py-4 rounded-2xl bg-white text-black font-semibold text-lg hover:bg-zinc-200 transition disabled:opacity-50"
          >
            {loading ? "Generating…" : "✨ Generate README"}
          </motion.button>

          <Link
            href="/dashboard"
            className="px-6 py-4 rounded-2xl border border-zinc-700 hover:bg-zinc-900 transition text-center font-medium"
          >
            ← Back
          </Link>
        </div>
      </motion.div>
    </main>
    </PageTransition>
  );
}
