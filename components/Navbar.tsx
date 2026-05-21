"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuthModal, useAuthUser } from "./AuthModal";
import { useReadmeHistory, setReadme, StoredReadme } from "@/lib/store/readmeStore";
import { useRouter } from "next/navigation";
import { History, LayoutDashboard, Settings, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { setOpen } = useAuthModal();
  const { user } = useAuthUser();
  const [historyOpen, setHistoryOpen] = useState(false);
  const history = useReadmeHistory();
  const router = useRouter();

  const handleRestore = (item: StoredReadme) => {
    setReadme(item);
    setHistoryOpen(false);
    router.push("/result");
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-zinc-800 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tighter">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500 text-black">
            <Zap size={18} fill="currentColor" />
          </div>
          <span>Readme<span className="text-green-400">AI</span></span>
        </Link>

        <nav className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            {}
            {user && history.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setHistoryOpen(!historyOpen)}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all ${
                    historyOpen ? "border-green-500/50 bg-green-500/10 text-green-400" : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  <History size={18} />
                </button>

                <AnimatePresence>
                  {historyOpen && (
                    <>
                      <div className="fixed inset-0 z-[-1]" onClick={() => setHistoryOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-72 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-2 shadow-2xl"
                      >
                        <div className="px-3 py-2">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Recent Workspaces</p>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {history.map((item) => (
                            <button
                              key={`${item.owner}/${item.repo}`}
                              onClick={() => handleRestore(item)}
                              className="flex w-full flex-col gap-1 rounded-xl px-3 py-3 text-left transition hover:bg-zinc-900"
                            >
                              <span className="text-sm font-bold text-zinc-200">{item.repo}</span>
                              <span className="text-[10px] text-zinc-500 font-mono">{item.owner}</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}

        {user ? (
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
          >
            <LayoutDashboard size={16} />
            Dashboard
          </Link>
        ) : (
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
          >
            <LayoutDashboard size={16} />
            Dashboard
          </button>
        )}

        {user && (
          <Link
            href="/settings"
            className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
          >
            <Settings size={16} />
            Settings
          </Link>
        )}

        {user ? (
          <div className="flex items-center gap-3 pl-2">
            <div className="hidden text-right md:block">
              <p className="text-[10px] font-bold text-white leading-none">{user.name || user.login}</p>
              <p className="text-[9px] text-zinc-500 font-mono mt-1">@{user.login}</p>
            </div>
            <div className="h-9 w-9 overflow-hidden rounded-xl border-2 border-zinc-800 bg-zinc-900">
              <img src={user.avatar_url} alt={user.login} className="h-full w-full object-cover" />
            </div>
          </div>
        ) : (
          <button
            onClick={() => setOpen(true)}
            className="rounded-xl bg-white px-5 py-2 text-xs font-bold text-black transition hover:bg-zinc-200"
          >
            Sign In
          </button>
        )}
          </div>
        </nav>
      </div>
    </header>
  );
}
