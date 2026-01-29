"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b border-zinc-800 bg-black/70 backdrop-blur">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
 
        <Link
          href="/"
          className="text-lg font-bold tracking-tight"
        >
          Readme<span className="text-green-400">AI</span>
        </Link>

        <nav className="flex items-center gap-8 text-sm text-zinc-400">
          <a
            href="/#features"
            className="hover:text-white transition"
          >
            Features
          </a>

          <a
            href="/#preview"
            className="hover:text-white transition"
          >
            Preview
          </a>

          <Link
            href="/dashboard"
            className="hover:text-white transition"
          >
            Dashboard
          </Link>

          <Link
            href="/"
            className="hover:text-white transition"
          >
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
}
