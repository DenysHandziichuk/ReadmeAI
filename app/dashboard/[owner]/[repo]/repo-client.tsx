"use client";

import { useState } from "react";
import { Toaster, toast } from "sonner";
import ReactMarkdown from "react-markdown";

export default function RepoClient({
  owner,
  repo,
}: {
  owner: string;
  repo: string;
}) {
  const [readme, setReadme] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function copyToClipboard() {
    if (!readme) return;

    try {
      await navigator.clipboard.writeText(readme);
      toast.success("README copied to clipboard");
    } catch (err) {
      console.error("Failed to copy README", err);
      toast.error("Failed to copy README");
    }
  }

  async function generateReadme() {
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner, repo }),
      });

      const data = await res.json();
      setReadme(data.readme);
      toast.success("README generated");
    } catch {
      toast.error("Failed to generate README");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-8 space-y-6">
      <Toaster position="bottom-right" richColors />

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
        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-semibold">README Preview</h2>

          <button
            onClick={copyToClipboard}
            className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
          >
            Copy to clipboard
          </button>

          <div className="prose max-w-none border rounded p-6 bg-black">
            <ReactMarkdown>{readme}</ReactMarkdown>
          </div>
        </div>
      )}
    </main>
  );
}
