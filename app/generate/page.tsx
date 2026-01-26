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
    <main className="min-h-screen bg-black text-white flex items-center justify-center pt-24">
      <div className="max-w-xl w-full text-center space-y-6 px-6">
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
          className="w-full py-3 bg-white text-black rounded-lg font-medium hover:bg-zinc-200 transition"
        >
          Generate README
        </button>
      </div>
    </main>
  );
}
