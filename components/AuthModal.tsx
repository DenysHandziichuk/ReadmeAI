"use client";

import { useEffect, useState, useCallback, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, X } from "lucide-react";
import { useRouter } from "next/navigation";

type AuthUser = {
  name: string;
  login: string;
  avatar_url: string;
} | null;

const AuthModalContext = createContext<{
  open: boolean;
  setOpen: (val: boolean) => void;
}>({ open: false, setOpen: () => {} });

const AuthUserContext = createContext<{
  user: AuthUser;
  loading: boolean;
  logout: () => Promise<void>;
}>({ user: null, loading: true, logout: async () => {} });

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/github/user");
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/github/disconnect", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  }, []);

  return (
    <AuthUserContext.Provider value={{ user, loading, logout }}>
      <AuthModalContext.Provider value={{ open, setOpen }}>
        {children}
        <AuthModalInternal />
      </AuthModalContext.Provider>
    </AuthUserContext.Provider>
  );
}

export function useAuthModal() {
  return useContext(AuthModalContext);
}

export function useAuthUser() {
  return useContext(AuthUserContext);
}

function AuthModalInternal() {
  const { open, setOpen } = useAuthModal();

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
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
  );
}

export default function AuthModal() {
  const { setOpen } = useAuthModal();
  const { user, loading } = useAuthUser();
  const router = useRouter();

  function handleClick() {
    if (user) {
      router.push("/dashboard");
    } else {
      setOpen(true);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="rounded-2xl bg-white px-6 py-3 font-semibold text-black shadow-lg transition hover:bg-zinc-200 disabled:opacity-50"
    >
      {loading ? "Loading..." : user ? "Go to Dashboard →" : "Try Out →"}
    </button>
  );
}
