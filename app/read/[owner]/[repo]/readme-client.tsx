"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Copy, Download, Github, ArrowLeft, Sparkles } from "lucide-react";
import { toast } from "sonner";
import MarkdownPreview from "@/components/MarkdownPreview";
import SkeletonReadme from "@/components/SkeletonReadme";
import { useAuthModal } from "@/components/AuthModal";

export function ReadmeClient({ owner, repo }: { owner: string; repo: string }) {
  const router = useRouter();
  const { setOpen } = useAuthModal();
  const [readme, setReadme] = useState("");
  const [tech, setTech] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function generate() {
      try {
        const res = await fetch("/api/readme/link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ owner, repo }),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Generation failed");
          return;
        }

        const data = await res.json();
        setReadme(data.readme);
        setTech(data.tech || []);
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    generate();
  }, [owner, repo]);

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(readme);
      toast.success("Copied README to clipboard");
    } catch {
      toast.error("Copy failed");
    }
  }

  function downloadReadme() {
    const blob = new Blob([readme], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
        <div className="max-w-md space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
            <Github size={32} />
          </div>
          <h1 className="text-2xl font-bold">Generation Failed</h1>
          <p className="text-sm text-zinc-400">{error}</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => router.push("/")}
              className="rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-3 text-sm font-bold transition hover:bg-zinc-800"
            >
              Try Another Repo
            </button>
            <button
              onClick={() => setOpen(true)}
              className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-zinc-200"
            >
              Sign In for Full Access
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-6 py-12 pt-24 text-white">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-5xl space-y-8"
      >
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-zinc-500">
              <button
                onClick={() => router.push("/")}
                className="text-xs font-bold tracking-widest uppercase transition hover:text-white"
              >
                Home
              </button>
              <span>/</span>
              <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
                {owner}
              </span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight">{repo}</h1>
            {tech.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {tech.slice(0, 8).map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1 text-[10px] font-bold tracking-wider text-zinc-400 uppercase"
                  >
                    {t}
                  </span>
                ))}
                {tech.length > 8 && (
                  <span className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1 text-[10px] font-bold text-zinc-500">
                    +{tech.length - 8}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="sticky top-20 z-40"
        >
          <div className="rounded-[2.5rem] border border-zinc-800 bg-black/90 p-5 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <a
                  href={`https://github.com/${owner}/${repo}`}
                  target="_blank"
                  className="flex h-10 items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
                >
                  <Github size={16} />
                  View Repo
                </a>
                <button
                  onClick={copyToClipboard}
                  disabled={loading}
                  className="flex h-10 items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white disabled:opacity-50"
                >
                  <Copy size={16} />
                  Copy
                </button>
                <button
                  onClick={downloadReadme}
                  disabled={loading}
                  className="flex h-10 items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white disabled:opacity-50"
                >
                  <Download size={16} />
                  Download
                </button>
              </div>

              <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(34,197,94,0.2)] transition hover:bg-green-500"
              >
                <Sparkles size={16} />
                Sign In for Commit & PR
              </button>
            </div>
          </div>
        </motion.div>

        <div className="min-h-[600px]">
          {loading ? (
            <div className="grid gap-10 lg:grid-cols-2">
              <div className="rounded-3xl border border-zinc-800 bg-zinc-950/50 p-8">
                <SkeletonReadme />
              </div>
              <div className="relative h-[600px] overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl">
                <div className="absolute inset-x-0 top-0 z-10 border-b border-zinc-800 bg-zinc-900/80 px-6 py-3 backdrop-blur">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                    <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                      Generating README...
                    </span>
                  </div>
                </div>
                <div className="flex h-full items-center justify-center p-8 pt-16 text-sm text-zinc-700 italic">
                  AI is crafting your README...
                </div>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 shadow-xl"
            >
              <MarkdownPreview content={readme} />
            </motion.div>
          )}
        </div>

        <div className="flex flex-col items-center gap-4 pb-10">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Try another repo
          </button>
        </div>
      </motion.div>
    </main>
  );
}
