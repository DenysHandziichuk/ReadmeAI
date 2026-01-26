"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  Github,
  Copy,
  GitBranch,
  CheckCircle,
  GitPullRequest,
} from "lucide-react";

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

  /* ======================= */
  /* ✅ Main Action */
  /* ======================= */
  async function handleAction() {
    if (mode === "commit" && !branch) {
      toast.error("Select a branch first ❌");
      return;
    }

    setLoading(true);

    try {
      /* ✅ COMMIT */
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
          }),
        });

        if (!res.ok) throw new Error();

        toast.success(`Committed to ${branch} ✅`, {
          id: "commit",
        });
      }

      /* ✅ PR */
      if (mode === "pr") {
        toast.loading("Creating PR...", { id: "pr" });

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

        toast.success("Pull Request created 🎉", {
          id: "pr",
        });

        window.open(data.prUrl, "_blank");
      }
    } catch {
      toast.error("Action failed ❌");
    } finally {
      setLoading(false);
    }
  }

  /* ======================= */
  /* ✅ Copy */
  /* ======================= */
  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(readme);
      toast.success("Copied README 📋");
    } catch {
      toast.error("Copy failed ❌");
    }
  }

  return (
  <div className="w-full flex flex-col gap-4">

    {/* ACTION ROW */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 w-full">

      {/* Branch Selector */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <GitBranch size={16} className="text-zinc-500 shrink-0" />

        <select
          value={branch}
          disabled={mode !== "commit"}
          onChange={(e) => setBranch(e.target.value)}
          className={`w-full sm:w-[170px] px-3 py-2 rounded-xl border text-sm
            ${
              mode === "commit"
                ? "bg-zinc-900 border-zinc-700 text-white"
                : "bg-zinc-950 border-zinc-800 text-zinc-600 cursor-not-allowed"
            }`}
        >
          {branches.length === 0 ? (
            <option>No branches</option>
          ) : (
            branches.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))
          )}
        </select>
      </div>

      {/* GitHub */}
      <a
        href={`https://github.com/${owner}/${repo}`}
        target="_blank"
        className="w-full sm:w-auto flex items-center justify-center gap-2
                   px-4 py-2 rounded-xl border border-zinc-700 text-sm
                   hover:bg-zinc-900 transition"
      >
        <Github size={16} />
        GitHub
      </a>

      {/* Copy */}
      <button
        onClick={copyToClipboard}
        className="w-full sm:w-auto flex items-center justify-center gap-2
                   px-4 py-2 rounded-xl border border-zinc-700 text-sm
                   hover:bg-zinc-900 transition"
      >
        <Copy size={16} />
        Copy
      </button>

      {/* Main Action */}
      <button
        disabled={loading}
        onClick={() =>
          mode === "commit" ? setConfirmOpen(true) : handleAction()
        }
        className="w-full sm:w-auto flex items-center justify-center gap-2
                   px-6 py-2 rounded-xl bg-green-600 hover:bg-green-700
                   font-semibold text-white disabled:opacity-50 transition
                   min-w-[160px]"
      >
        {loading && (
          <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
        )}

        {!loading && mode === "commit" && (
          <>
            <CheckCircle size={18} />
            Commit
          </>
        )}

        {!loading && mode === "pr" && (
          <>
            <GitPullRequest size={18} />
            Create PR
          </>
        )}

        {loading && (
          <span>{mode === "commit" ? "Committing..." : "Creating..."}</span>
        )}
      </button>

      {/* Mode Dropdown */}
      <select
        value={mode}
        onChange={(e) => setMode(e.target.value as any)}
        className="w-full sm:w-auto px-3 py-2 rounded-xl border border-zinc-700
                   bg-zinc-950 text-sm cursor-pointer"
      >
        <option value="commit">Commit</option>
        <option value="pr">PR</option>
      </select>
    </div>

    {/* Confirm Modal */}
    {confirmOpen && (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-md w-full space-y-4">
          <h2 className="font-bold text-lg">⚠️ Confirm Commit</h2>

          <p className="text-sm text-zinc-400">
            Overwrite README.md in <b>{branch}</b>?
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setConfirmOpen(false)}
              className="flex-1 border border-zinc-600 rounded-lg py-2 hover:bg-zinc-800 transition"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                setConfirmOpen(false);
                handleAction();
              }}
              className="flex-1 bg-green-600 rounded-lg py-2 font-semibold hover:bg-green-700 transition"
            >
              Yes, Commit
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
)};
