"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

  const [branches, setBranches] = useState<string[]>([]);
  const [branch, setBranch] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [mode, setMode] = useState<"commit" | "pr">("commit");
  const [loading, setLoading] = useState(false);

  // ✅ Load branches automatically
  useEffect(() => {
    async function loadBranches() {
      const res = await fetch("/api/github/branches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner, repo }),
      });

      const data = await res.json();

      if (data.branches?.length) {
        setBranches(data.branches);
        setBranch(data.branches[0]);
      }
    }

    loadBranches();
  }, [owner, repo]);

  // ✅ Commit handler
  async function handleAction() {
    if (!branch) return;

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

        toast.success(`README committed to ${branch} 🎉`);
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

  toast.success("Pull Request created 🎉");

  // Open PR in new tab
  window.open(data.prUrl, "_blank");
}

    } catch {
      toast.error("Commit failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 mt-6">
      {/* Branch dropdown */}
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

      {/* Split Button */}
      <div className="flex w-full max-w-lg">
        <button
          onClick={() => setConfirmOpen(true)}
          className="flex-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-l-lg font-semibold"
        >
          {loading
            ? "Working..."
            : mode === "commit"
            ? "Commit README"
            : "Create PR"}
        </button>
        {confirmOpen && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-full max-w-md space-y-4">
      
      <h2 className="text-lg font-bold">
        ⚠️ Confirm Commit
      </h2>

      <p className="text-zinc-300 text-sm">
        This will directly commit a new <b>README.md</b> into:
      </p>

      <div className="text-sm font-mono bg-zinc-800 p-3 rounded">
        {owner}/{repo} → branch: <b>main</b>
      </div>

      <p className="text-zinc-400 text-sm">
        This action changes the repository immediately.
      </p>

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
            handleAction(); // real commit happens here
          }}
          className="flex-1 bg-green-600 rounded-lg py-2 font-semibold hover:bg-green-700"
        >
          Yes, Commit
        </button>
      </div>
    </div>
  </div>
)}


        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as any)}
          className="flex-1 bg-green-700 text-white px-3 rounded-r-lg cursor-pointer"
        >
          <option value="commit">Commit</option>
          <option value="pr">PR</option>
        </select>
      </div>

      {/* Back */}
      <button
        onClick={() => router.push("/dashboard")}
        className="w-full py-3 border border-zinc-700 rounded-lg hover:bg-zinc-900"
      >
        ← Back to repos
      </button>
    </div>
  );
}
