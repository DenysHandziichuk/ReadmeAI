"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  Github,
  Copy,
  GitBranch,
  CheckCircle,
  GitPullRequest,
  Shield,
} from "lucide-react";

export default function ResultActions({
  owner,
  repo,
  readme,
  branches,
  branch,
  setBranch,
  onSuccess,
  children,
  onAddLicense,
}: {
  owner: string;
  repo: string;
  readme: string;
  branches: string[];
  branch: string;
  setBranch: (b: string) => void;
  onSuccess?: () => void;
  children?: React.ReactNode;
  onAddLicense?: (license: string) => void;
}) {
  const [mode, setMode] = useState<"commit" | "pr">("commit");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  
  
  
  async function handleAction() {
    if (mode === "commit" && !branch) {
      toast.error("Select a branch first ❌");
      return;
    }

    setLoading(true);

    try {
      
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
        onSuccess?.();
      }

      
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
        onSuccess?.();

        window.open(data.prUrl, "_blank");
      }
    } catch {
      toast.error("Action failed ❌");
    } finally {
      setLoading(false);
    }
  }

  
  
  
  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(readme);
      toast.success("Copied README 📋");
    } catch {
      toast.error("Copy failed ❌");
    }
  }

  return (
    <div className="flex w-full flex-col gap-8">
      {}
      <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        
        {}
        <div className="flex-1 overflow-x-auto pb-2 lg:pb-0">
          <div className="flex flex-col gap-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">Live Badge Configuration</p>
            {children}
          </div>
        </div>

        {}
        <div className="flex flex-wrap items-center gap-4 shrink-0">
          
          {}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Shield size={12} className="text-zinc-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">License</span>
            </div>
            <select
              onChange={(e) => onAddLicense?.(e.target.value)}
              className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm font-medium transition-all hover:border-zinc-700 text-zinc-400"
              defaultValue=""
            >
              <option value="" disabled>Add License</option>
              <option value="MIT">MIT</option>
              <option value="Apache">Apache 2.0</option>
              <option value="GPL">GPLv3</option>
              <option value="UNLICENSE">Unlicense</option>
            </select>
          </div>

          {}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <GitBranch size={12} className="text-zinc-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Branch</span>
            </div>
            <select
              value={branch}
              disabled={mode !== "commit"}
              onChange={(e) => setBranch(e.target.value)}
              className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                mode === "commit"
                  ? "border-zinc-700 bg-zinc-900 text-white"
                  : "cursor-not-allowed border-zinc-800 bg-zinc-950 text-zinc-600"
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

          <div className="h-12 w-px bg-zinc-800/50 hidden sm:block mx-2" />

          {}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 ml-1">Quick Actions</span>
            <div className="flex items-center gap-3">
              <a
                href={`https://github.com/${owner}/${repo}`}
                target="_blank"
                className="flex h-11 items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
              >
                <Github size={16} />
                <span className="hidden sm:inline">GitHub</span>
              </a>

              <button
                onClick={copyToClipboard}
                className="flex h-11 items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
              >
                <Copy size={16} />
                <span className="hidden sm:inline">Copy</span>
              </button>

              {}
              <div className="flex items-center gap-1 ml-2">
                <button
                  disabled={loading}
                  onClick={() =>
                    mode === "commit" ? setConfirmOpen(true) : handleAction()
                  }
                  className="flex h-11 min-w-[140px] items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-2 text-sm font-bold text-white transition hover:bg-green-500 disabled:opacity-50 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                >
                  {loading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  ) : mode === "commit" ? (
                    <CheckCircle size={18} />
                  ) : (
                    <GitPullRequest size={18} />
                  )}
                  {loading ? "..." : mode === "commit" ? "Commit" : "Create PR"}
                </button>

                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as any)}
                  className="flex h-11 cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-400 outline-none hover:text-white"
                >
                  <option value="commit">Commit</option>
                  <option value="pr">PR</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md space-y-4 rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-white">⚠️ Confirm Changes</h2>
            <p className="text-sm leading-relaxed text-zinc-400">
              This will overwrite the README.md file in the <b>{branch}</b> branch. Are you sure you want to proceed?
            </p>
            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <button
                onClick={() => setConfirmOpen(false)}
                className="flex-1 rounded-xl border border-zinc-700 py-3 text-sm font-bold text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setConfirmOpen(false);
                  handleAction();
                }}
                className="flex-1 rounded-xl bg-green-600 py-3 text-sm font-bold text-white transition hover:bg-green-500"
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
