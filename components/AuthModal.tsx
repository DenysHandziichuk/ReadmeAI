"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, X } from "lucide-react";

export default function AuthModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-2xl bg-white px-6 py-3 font-semibold text-black shadow-lg transition hover:bg-zinc-200"
      >
        Get Started →
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md space-y-6 rounded-3xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 text-zinc-500 transition hover:text-white"
              >
                <X size={18} />
              </button>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Sign in to continue
                </h2>

                <p className="text-sm leading-relaxed text-zinc-400">
                  Connect your GitHub account to instantly generate{" "}
                  <span className="font-medium text-white">
                    product-style READMEs
                  </span>{" "}
                  for your repositories.
                </p>
              </div>

              <a
                href="/api/auth/github"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3 font-semibold text-black shadow-md transition hover:bg-zinc-200"
              >
                <Github size={18} />
                Continue with GitHub
              </a>

              <p className="text-center text-xs leading-relaxed text-zinc-500">
                We never store your password. Authentication is handled securely
                through GitHub OAuth.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
