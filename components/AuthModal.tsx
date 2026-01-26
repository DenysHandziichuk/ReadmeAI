"use client";

import { useState } from "react";

export default function AuthModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ✅ Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="px-6 py-3 rounded-xl bg-white text-black font-semibold
                   hover:bg-zinc-200 transition shadow-lg"
      >
        Get Started →
      </button>

      {/* ✅ Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-zinc-900 rounded-2xl w-full max-w-sm p-7 space-y-5 border border-zinc-800 shadow-xl">
            <h2 className="text-xl font-semibold text-white">
              Sign in to continue
            </h2>

            <p className="text-sm text-zinc-400 leading-relaxed">
              Connect your GitHub account to generate premium Mode B READMEs for
              your repositories.
            </p>

            {/* GitHub OAuth */}
            <a
              href="/api/auth/github"
              className="block w-full text-center px-4 py-2 bg-white text-black rounded-xl font-medium hover:bg-zinc-200 transition"
            >
              Sign in with GitHub
            </a>

            {/* Cancel */}
            <button
              onClick={() => setOpen(false)}
              className="block w-full text-center text-sm text-zinc-500 hover:text-zinc-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
