"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function GeneratePage() {
  const router = useRouter();
  const params = useSearchParams();

  const owner = params.get("owner");
  const repo = params.get("repo");

  if (!owner || !repo) {
    router.replace("/dashboard");
    return null;
  }

  function handleGenerate() {
    router.push(`/generate/loading?owner=${owner}&repo=${repo}`);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black pt-24 text-white">
      <div className="w-full max-w-xl space-y-6 px-6 text-center">
        <h1 className="text-3xl font-bold">Generate README</h1>

        <p className="text-zinc-400">
          Repository:
          <br />
          <span className="font-mono text-white">
            {owner}/{repo}
          </span>
        </p>

        <button
          onClick={handleGenerate}
          className="w-full rounded-lg bg-white py-3 font-medium text-black transition hover:bg-zinc-200"
        >
          Generate README
        </button>
      </div>
    </main>
  );
}
