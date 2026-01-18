"use client";

import { useState } from "react";

export default function RepoClient({
  owner,
  repo,
}: {
  owner: string;
  repo: string;
}) {
  const [readme, setReadme] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function generateReadme() {
    console.log("Client received:", owner, repo);
    setLoading(true);

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ owner, repo }),
    });

    const data = await res.json();
    setReadme(data.readme);
    setLoading(false);
  }

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">
        {owner}/{repo}
      </h1>

      <button
        onClick={generateReadme}
        disabled={loading}
        className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate README"}
      </button>

      {readme && (
        <div>
          <h2 className="font-semibold mb-2">README Preview</h2>
          <textarea
            value={readme}
            readOnly
            className="w-full h-100 font-mono text-sm border rounded p-3"
          />
        </div>
      )}
    </main>
  );
}
