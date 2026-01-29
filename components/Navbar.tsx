"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-zinc-800 bg-black/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Readme<span className="text-green-400">AI</span>
        </Link>

        <nav className="flex items-center gap-8 text-sm text-zinc-400">
          <a href="/#features" className="transition hover:text-white">
            Features
          </a>

          <a href="/#preview" className="transition hover:text-white">
            Preview
          </a>

          <Link href="/dashboard" className="transition hover:text-white">
            Dashboard
          </Link>

          <Link href="/" className="transition hover:text-white">
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
}
