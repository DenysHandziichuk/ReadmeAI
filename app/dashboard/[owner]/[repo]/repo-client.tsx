"use client";

import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
        credentials: "include",
        body: JSON.stringify({ owner, repo }),
      });

      if (!res.ok) {
        toast.error("Generate failed ❌");
        return;
      }

      const data = await res.json();

      setReadme({
        owner,
        repo,
        content: data.readme,
      });

      toast.success("README generated 🎉");

      router.push("/result");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate README");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white linear-bg px-6 py-14">
      <Toaster position="bottom-right" richColors />

      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">
            Generate a Premium README
          </h1>

          <p className="text-zinc-400 text-lg max-w-xl">
            Readme Generator will create a clean product-style landing README with badges,
            features, workflow, install steps, and GitHub commit/PR support.
          </p>
        </div>

        {/* Repo Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl space-y-3">
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
        </div>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={generateReadme}
            disabled={loading}
            className="flex-1 px-6 py-4 rounded-2xl bg-white text-black font-semibold text-lg hover:bg-zinc-200 transition disabled:opacity-50"
          >
            {loading ? "Generating…" : "✨ Generate README"}
          </button>

          <Link
            href="/dashboard"
            className="px-6 py-4 rounded-2xl border border-zinc-700 hover:bg-zinc-900 transition text-center font-medium"
          >
            ← Back
          </Link>
        </div>

        {/* Feature Hint Row */}
        <div className="grid md:grid-cols-3 gap-4 pt-6">
          {[
            {
              title: "Product-ready",
              desc: "No analyzer templates. Pure product README.",
            },
            {
              title: "Badges Included",
              desc: "Auto-injected under the intro.",
            },
            {
              title: "Commit or PR",
              desc: "Push instantly or open a pull request.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 hover:bg-zinc-900 transition"
            >
              <h3 className="font-semibold">{f.title}</h3>
              <p className="text-sm text-zinc-400 mt-2">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="text-xs text-zinc-600 text-center pt-8">
          Premium README generation flow
        </p>
      </div>
    </main>
  );
}
