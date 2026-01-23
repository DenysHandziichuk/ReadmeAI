"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ResultActions({
  owner,
  repo,
  readme,
}: {
  owner: string;
  repo: string;
  readme: string;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"commit" | "pr">("commit");
  const [loading, setLoading] = useState(false);

  async function handleAction() {
    setLoading(true);

    try {
      if (mode === "commit") {
        const res = await fetch("/api/github/commit-readme", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            owner,
            repo,
            branch: "main",
            content: readme,
            message: "Add generated README",
          }),
        });

        if (!res.ok) throw new Error();
        toast.success("README committed 🎉");
      }

      if (mode === "pr") {
        toast.info("Pull Request coming next 👀");
      }
    } catch {
      toast.error("Action failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-3 mt-6">
      {/* Split button */}
      <div className="flex w-full max-w-md">
        <button
          onClick={handleAction}
          disabled={loading}
          className="flex-[4] bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-l-lg font-semibold"
        >
          {loading
            ? "Working..."
            : mode === "commit"
            ? "Commit to GitHub"
            : "Create Pull Request"}
        </button>

        <select
          value={mode}
          onChange={e => setMode(e.target.value as any)}
          className="flex-[1] bg-green-700 text-white px-3 rounded-r-lg cursor-pointer"
        >
          <option value="commit">Commit</option>
          <option value="pr">PR</option>
        </select>
      </div>

      {/* Back button */}
      <button
        onClick={() => router.push("/dashboard")}
        className="px-6 py-3 border border-zinc-700 rounded-lg hover:bg-zinc-900"
      >
        ← Back to repos
      </button>
      <ResultActions
        owner={owner}
        repo={repo}
        readme={readme}
      />
    </div>
  );
}
