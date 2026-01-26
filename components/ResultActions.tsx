"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function ResultActions({
  owner,
  repo,
  readme,
  branches,
  branch,
  setBranch,
}: {
  owner: string;
  repo: string;
  readme: string;

  branches: string[];
  branch: string;
  setBranch: (b: string) => void;
}) {
  const [mode, setMode] = useState<"commit" | "pr">("commit");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleAction() {
    setLoading(true);

    try {
      if (mode === "commit") {
        const res = await fetch("/api/github/commit-readme", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            owner,
            repo,
            branch,
            content: readme,
            message: "Add generated README",
          }),
        });

        if (!res.ok) throw new Error();
        toast.success(`Committed to ${branch} ✅`);
      }

      if (mode === "pr") {
        const res = await fetch("/api/github/create-pr", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ owner, repo, content: readme }),
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        toast.success("Pull Request created 🎉");
        window.open(data.prUrl, "_blank");
      }
    } catch {
      toast.error(mode === "commit" ? "Commit failed ❌" : "PR failed ❌");
    } finally {
      setLoading(false);
    }
  }

  async function copyToClipboard() {
    await navigator.clipboard.writeText(readme);
    toast.success("Copied 📋");
  }

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Branch */}
      {mode === "commit" && (
        <select
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-sm"
        >
          {branches.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      )}

      {/* Split */}
      <div className="flex overflow-hidden rounded-xl border border-zinc-700">
        <button
          disabled={loading}
          onClick={() =>
            mode === "commit" ? setConfirmOpen(true) : handleAction()
          }
          className="flex-4 px-6 py-2 bg-green-600 hover:bg-green-700 font-semibold"
        >
          {loading ? "Working..." : mode === "commit" ? "Commit" : "Create PR"}
        </button>

        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as any)}
          className="bg-green-700 flex-1 px-3 cursor-pointer"
        >
          <option value="commit">Commit</option>
          <option value="pr">PR</option>
        </select>
      </div>

      {/* Copy */}
      <button
        onClick={copyToClipboard}
        className="px-4 py-2 border border-zinc-700 rounded-xl hover:bg-zinc-900 transition"
      >
        Copy
      </button>

      {/* Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-md w-full space-y-4">
            <h2 className="font-bold text-lg">⚠️ Confirm Commit</h2>

            <p className="text-sm text-zinc-400">
              Overwrite README.md in <b>{branch}</b>?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="flex-1 border border-zinc-600 rounded-lg py-2"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setConfirmOpen(false);
                  handleAction();
                }}
                className="flex-1 bg-green-600 rounded-lg py-2 font-semibold"
              >
                Yes, Commit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
