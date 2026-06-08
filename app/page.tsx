"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ReadmeDemo from "@/components/ReadmeDemo";
import AuthModal from "@/components/AuthModal";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

function parseGithubUrl(input: string): { owner: string; repo: string } | null {
  const trimmed = input.trim();
  const fullMatch = trimmed.match(
    /^https?:\/\/github\.com\/([^/]+)\/([^/\s?#]+)/,
  );
  if (fullMatch) return { owner: fullMatch[1], repo: fullMatch[2] };

  const shorthand = trimmed.match(/^([^/\s]+)\/([^/\s]+)$/);
  if (shorthand) return { owner: shorthand[1], repo: shorthand[2] };

  return null;
}

export default function HomePage() {
  const router = useRouter();
  const [repoInput, setRepoInput] = useState("");
  const [error, setError] = useState("");

  function handleTryOut(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const parsed = parseGithubUrl(repoInput);
    if (!parsed) {
      setError(
        "Enter a valid GitHub URL (e.g. https://github.com/owner/repo) or owner/repo",
      );
      return;
    }

    router.push(`/read/${parsed.owner}/${parsed.repo}`);
  }

  return (
    <main className="linear-bg min-h-screen overflow-hidden text-white">
      <section className="flex items-center justify-center px-6 pt-24 pb-20">
        <div className="relative max-w-4xl space-y-10 text-center">
          <div className="absolute inset-0 -z-10 flex justify-center">
            <div className="h-[650px] w-[650px] rounded-full bg-green-500/10 blur-[130px]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-400"
          >
            🚀 Premium README Generator
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-bold tracking-tight md:text-6xl"
          >
            Generate <span className="text-green-400">Product READMEs</span>
            <br />
            that look like real startups.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="mx-auto max-w-2xl text-lg leading-relaxed text-zinc-400"
          >
            Turn any GitHub repository into a landing-page style README —
            badges, features, install steps, and instant commit or PR support.
          </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35 }}
          className="mx-auto flex max-w-xl flex-col items-center gap-5"
        >
          <AuthModal />
          <div className="flex w-full items-center gap-4">
            <div className="h-px flex-1 bg-zinc-800" />
            <span className="text-xs font-bold tracking-widest text-zinc-600 uppercase">
              or paste a repo link
            </span>
            <div className="h-px flex-1 bg-zinc-800" />
          </div>
          <form onSubmit={handleTryOut} className="w-full flex flex-col gap-3">
            <div className="flex gap-3">
              <input
                type="text"
                value={repoInput}
                onChange={(e) => {
                  setRepoInput(e.target.value);
                  setError("");
                }}
                placeholder="Paste a GitHub repo URL... (e.g. vercel/next.js)"
                className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-3 text-sm text-white placeholder-zinc-600 transition outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-700"
              />
              <button
                type="submit"
                className="flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-3 text-sm font-bold text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
              >
                Generate
                <ArrowRight size={16} />
              </button>
            </div>
            {error && <p className="text-left text-xs text-red-400">{error}</p>}
            <p className="text-xs text-zinc-500">
              No sign-in required — try it with any public repo.
            </p>
          </form>
        </motion.div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="mb-10 text-3xl font-bold">
          Everything you need for a perfect README
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Product style",
              desc: "No analyzer templates. Pure product landing README output.",
            },
            {
              title: "Badges Included",
              desc: "Auto-injected under the intro. Clean and deterministic.",
            },
            {
              title: "Commit or PR",
              desc: "Push directly to any branch or open a Pull Request instantly.",
            },
          ].map((f) => (
            <motion.div
              key={f.title}
              whileHover={{ scale: 1.03, y: -5 }}
              transition={{ type: "spring", stiffness: 250 }}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 hover:bg-zinc-900"
            >
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="preview" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="mb-6 text-3xl font-bold">Live Demo Preview</h2>

        <p className="mb-10 max-w-xl text-zinc-400">
          Watch how ReadmeAI turns your repo into a product landing README.
        </p>

        <ReadmeDemo />
      </section>

      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          <h2 className="text-4xl font-bold">Ready to ship premium READMEs?</h2>

          <p className="text-lg text-zinc-400">
            Sign in with GitHub and generate your first README in seconds.
          </p>

          <AuthModal />
        </div>
      </section>

      <footer className="border-t border-zinc-800 py-10 text-center text-sm text-zinc-500">
        Built by DenysHandziichuk • 2026
      </footer>
    </main>
  );
}
