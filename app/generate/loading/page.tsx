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
        owner: owner as string,
        repo: repo as string,
        content: data.readme,
      });

      console.log("README STORED");

      router.replace("/result");
    }

    generate();
  }, [params, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="w-full max-w-md space-y-6 px-6">
        <div className="h-6 animate-pulse rounded bg-zinc-800" />
        <div className="h-6 w-3/4 animate-pulse rounded bg-zinc-800" />
        <div className="h-6 w-1/2 animate-pulse rounded bg-zinc-800" />

        <p className="pt-4 text-center text-zinc-400">
          Analyzing repository and generating README…
        </p>
      </div>
    </main>
  );
}
