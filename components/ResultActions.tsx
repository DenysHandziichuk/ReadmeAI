"use client";

import { useEffect, useState } from "react";
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
  const [mode, setMode] = useState<"commit" | "pr">("commit");

  const [branches, setBranches] = useState<string[]>([]);
  const [branch, setBranch] = useState("");

  const [prConfirmOpen, setPrConfirmOpen] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

 
  useEffect(() => {
    async function loadBranches() {
      try {
        const res = await fetch("/api/github/branches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ owner, repo }),
        });

        if (!res.ok) throw new Error();

        const data = await res.json();

        if (data.branches?.length) {
          setBranches(data.branches);
          setBranch(data.branches[0]);
        }
      } catch {
        toast.error("Failed to load branches ❌");
      }
    }

    loadBranches();
  }, [owner, repo]);

 
  async function handleAction() {
    if (mode === "commit" && !branch) return;

    setLoading(true);

    try {
     
      if (mode === "commit") {
        const res = await fetch("/api/github/commit-readme", {
          method: "POST",
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

        toast.success(`README committed to ${branch} ✅`);
      }

     
      if (mode === "pr") {
        const res = await fetch("/api/github/create-pr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            owner,
            repo,
            content: readme,
          }),
        });

        if (!res.ok) throw new Error();

        const data = await res.json();

        toast.success("PR created 🎉 Opening GitHub...");
        window.open(data.prUrl, "_blank");
      }
    } catch {
      toast.error(mode === "commit" ? "Commit failed ❌" : "PR failed ❌");
    } finally {
      setLoading(false);
    }
  }

  async function copyToClipboard() {
    if (!readme) return;

    try {
      await navigator.clipboard.writeText(readme);
      toast.success("README copied 📋");
    } catch (err) {
      console.error(err);
      toast.error("Copy failed");
    }
  }

  return (
    <div className="space-y-4 mt-6">
      {/* ✅ Branch Dropdown (Commit only) */}
      {mode === "commit" && (
        <div>
          <p className="text-sm text-zinc-400 mb-1">Target branch:</p>

          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="w-full border border-zinc-700 bg-black text-white p-2 rounded-lg"
          >
            {branches.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* ✅ Split Button */}
      <div className="flex w-full max-w-lg overflow-hidden rounded-lg">
        {/* Main Button */}
        <button
          disabled={loading}
          onClick={() => {
            if (mode === "commit") {
              setConfirmOpen(true);
            } else {
              setPrConfirmOpen(true);
            }
          }}
          className="w-[80%] bg-green-600 hover:bg-green-700 text-white px-6 py-3 font-semibold disabled:opacity-50"
        >
          {loading
            ? "Working..."
            : mode === "commit"
            ? "Commit README"
            : "Create PR"}
        </button>

        {/* Dropdown */}
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as any)}
          className="w-[20%] bg-green-700 text-white text-center cursor-pointer"
        >
          <option value="commit">Commit</option>
          <option value="pr">PR</option>
        </select>
      </div>

      <button
                      onClick={copyToClipboard}
                      className="px-4 py-2 border border-zinc-700 rounded-lg hover:bg-zinc-900 transition"
                    >
                      Copy Markdown
                    </button>

      {/* ✅ Confirm Modal */}
      {confirmOpen && mode === "commit" && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-bold">⚠️ Confirm Commit</h2>

            <p className="text-sm text-zinc-300">
              This will overwrite <b>README.md</b> in:
            </p>

            <div className="text-sm font-mono bg-zinc-800 p-3 rounded">
              {owner}/{repo} → <b>{branch}</b>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setConfirmOpen(false)}
                className="flex-1 border border-zinc-600 rounded-lg py-2 hover:bg-zinc-800"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setConfirmOpen(false);
                  handleAction();
                }}
                className="flex-1 bg-green-600 rounded-lg py-2 font-semibold hover:bg-green-700"
              >
                Yes, Commit
              </button>
            </div>
          </div>
        </div>
        
      )}{prConfirmOpen && mode === "pr" && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-full max-w-md space-y-4">
      <h2 className="text-lg font-bold">🚀 Confirm Pull Request</h2>

      <p className="text-sm text-zinc-300">
        This will create a new branch and open a PR into:
      </p>

      <div className="text-sm font-mono bg-zinc-800 p-3 rounded">
        {owner}/{repo} → <b>default branch</b>
      </div>

      <p className="text-zinc-400 text-sm">
        Recommended if you don’t want to commit directly.
      </p>

      <div className="flex gap-3 pt-2">
        <button
          onClick={() => setPrConfirmOpen(false)}
          className="flex-1 border border-zinc-600 rounded-lg py-2 hover:bg-zinc-800"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            setPrConfirmOpen(false);
            handleAction();
          }}
          className="flex-1 bg-green-600 rounded-lg py-2 font-semibold hover:bg-green-700"
        >
          Yes, Create PR
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
