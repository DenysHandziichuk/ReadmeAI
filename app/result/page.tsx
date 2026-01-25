"use client";

import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useStoredReadme, clearReadme } from "@/lib/store/readmeStore";
import ResultActions from "@/components/ResultActions";

export default function ResultPage() {
  const router = useRouter();

  // ✅ Load README from sessionStorage
  const stored = useStoredReadme();

  // ✅ Redirect if nothing exists
  useEffect(() => {
    if (stored === null) return; // still loading

    if (!stored?.content) {
      router.replace("/dashboard");
    }
  }, [stored, router]);

  // ⏳ Loading state while hook reads storage
  if (stored === null) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-400">Loading README…</p>
      </main>
    );
  }

  // ❌ Safety fallback
  if (!stored.content) return null;

  return (
    <main className="min-h-screen bg-black text-white px-8 py-10 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold">README Generated</h1>
        <p className="text-zinc-400 mt-2">
          {stored.owner}/{stored.repo}
        </p>
      </div>

      {/* Actions */}
      <ResultActions
        owner={stored.owner}
        repo={stored.repo}
        readme={stored.content}
      />

      {/* Preview */}
      <div className="prose prose-invert max-w-none border border-zinc-800 rounded-xl p-6 bg-zinc-950">
        <ReactMarkdown>{stored.content}</ReactMarkdown>
      </div>

      {/* Back */}
      <Link
        href="/dashboard"
        onClick={() => clearReadme()}
        className="inline-block text-zinc-400 hover:text-white"
      >
        ← Back to repositories
      </Link>
    </main>
  );
}
