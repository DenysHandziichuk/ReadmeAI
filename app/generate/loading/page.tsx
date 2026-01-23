"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setReadme } from "@/lib/store/readmeStore";

export default function LoadingPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const owner = params.get("owner");
    const repo = params.get("repo");

    if (!owner || !repo) {
      router.replace("/dashboard");
      return;
    }

    async function generate() {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner, repo }),
      });

      const data = await res.json();

      setReadme({
  owner,
  repo,
  content: data.readme,
});

console.log("README STORED");


      router.replace("/result");
    }

    generate();
  }, [params, router]);

  // ⬇️ UI SKELETON — UNCHANGED ⬇️
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md w-full px-6 space-y-6">
        <div className="h-6 bg-zinc-800 rounded animate-pulse" />
        <div className="h-6 bg-zinc-800 rounded animate-pulse w-3/4" />
        <div className="h-6 bg-zinc-800 rounded animate-pulse w-1/2" />

        <p className="text-zinc-400 text-center pt-4">
          Analyzing repository and generating README…
        </p>
      </div>
    </main>
  );
}
