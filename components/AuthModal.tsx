"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, X } from "lucide-react";

export default function AuthModal() {
  const [open, setOpen] = useState(false);

  // ✅ Close on Escape
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open]);

  return (
    <>
      {/* ✅ Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="px-6 py-3 rounded-2xl bg-white text-black font-semibold
                   hover:bg-zinc-200 transition shadow-lg"
      >
        Get Started →
      </button>

      {/* ✅ Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)} // click outside closes
          >
            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-3xl border border-zinc-800
                         bg-zinc-950 p-8 shadow-2xl space-y-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white transition"
              >
                <X size={18} />
              </button>

              {/* Header */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Sign in to continue
                </h2>

                <p className="text-sm text-zinc-400 leading-relaxed">
                  Connect your GitHub account to instantly generate{" "}
                  <span className="text-white font-medium">
                     product-style READMEs
                  </span>{" "}
                  for your repositories.
                </p>
              </div>

              {/* GitHub Button */}
              <a
                href="/api/auth/github"
                className="flex items-center justify-center gap-2 w-full
                           rounded-2xl bg-white text-black font-semibold
                           py-3 hover:bg-zinc-200 transition shadow-md"
              >
                <Github size={18} />
                Continue with GitHub
              </a>

              {/* Footer Note */}
              <p className="text-xs text-zinc-500 text-center leading-relaxed">
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
