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

  /* ✅ Main Action */
  async function handleAction() {
    if (mode === "commit" && !branch) {
      toast.error("Please select a branch first ❌");
      return;
    }

    setLoading(true);

    try {
      /* ========================= */
      /* ✅ COMMIT MODE */
      /* ========================= */
      if (mode === "commit") {
        toast.loading("Committing README...", { id: "commit" });

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

        toast.success(`README committed to ${branch} ✅`, {
          id: "commit",
        });
      }

      /* ========================= */
      /* ✅ PR MODE */
      /* ========================= */
      if (mode === "pr") {
        toast.loading("Creating Pull Request...", { id: "pr" });

        const res = await fetch("/api/github/create-pr", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            owner,
            repo,
            content: readme,
          }),
        });

        if (!res.ok) throw new Error();

        const data = await res.json();

        toast.success("Pull Request created 🎉 Opening GitHub...", {
          id: "pr",
        });

        window.open(data.prUrl, "_blank");
      }
    } catch {
      toast.error(
        mode === "commit"
          ? "Commit failed ❌"
          : "Pull Request failed ❌"
      );
    } finally {
      setLoading(false);
    }
  }

  /* ✅ Copy */
  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(readme);

      toast.success("README copied to clipboard 📋");
    } catch {
      toast.error("Copy failed ❌");
    }
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
      {/* ======================= */}
      {/* LEFT: Branch Selector */}
      {/* ======================= */}
      {mode === "commit" && (
        <div className="flex items-center gap-2">
          <p className="text-sm text-zinc-400">Target branch:</p>

          <select
            value={branch}
            onChange={(e) => {
              setBranch(e.target.value);
              toast.message(`Selected branch: ${e.target.value}`);
            }}
            className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white"
          >
            {branches.length === 0 ? (
              <option>No branches found</option>
            ) : (
              branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))
            )}
          </select>
        </div>
      )}

      {/* ======================= */}
      {/* RIGHT: Action Buttons */}
      {/* ======================= */}
      <div className="flex items-center gap-3">
        {/* Copy */}
        <button
          onClick={copyToClipboard}
          className="pointer px-4 py-2 border border-zinc-700 rounded-xl hover:bg-zinc-900 transition text-sm"
        >
          Copy
        </button>

        {/* Split Commit / PR */}
        <div className="flex overflow-hidden rounded-xl border border-zinc-700">
          <button
            disabled={loading}
            onClick={() =>
              mode === "commit"
                ? setConfirmOpen(true)
                : handleAction()
            }
            className="px-6 py-2 bg-green-600 hover:bg-green-700 font-semibold text-white disabled:opacity-50"
          >
            {loading
              ? "Working..."
              : mode === "commit"
              ? "Commit README"
              : "Create PR"}
          </button>

          <select
            value={mode}
            onChange={(e) => {
              setMode(e.target.value as any);

              toast.message(
                e.target.value === "commit"
                  ? "Commit mode enabled ✅"
                  : "PR mode enabled 🚀"
              );
            }}
            className="bg-green-700 px-3 text-sm text-white cursor-pointer"
          >
            <option value="commit">Commit</option>
            <option value="pr">PR</option>
          </select>
        </div>
      </div>

      {/* ======================= */}
      {/* Confirm Commit Modal */}
      {/* ======================= */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-md w-full space-y-4">
            <h2 className="font-bold text-lg">⚠️ Confirm Commit</h2>

            <p className="text-sm text-zinc-400">
              Overwrite README.md in <b>{branch}</b>?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setConfirmOpen(false);
                  toast.message("Commit cancelled ❌");
                }}
                className="flex-1 border border-zinc-600 rounded-lg py-2 hover:bg-zinc-800"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setConfirmOpen(false);
                  toast.success("Confirmed commit ✅");
                  handleAction();
                }}
                className="flex-1 bg-green-600 rounded-lg py-2 font-semibold hover:bg-green-700"
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
