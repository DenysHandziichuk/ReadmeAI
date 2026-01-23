"use client";

import { useState } from "react";
import AuthModal from "@/components/AuthModal";

export default function LandingPage() {
  const [open, setOpen] = useState(false);

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="max-w-2xl text-center space-y-6 px-6">
        <h1 className="text-4xl sm:text-5xl font-bold">
          Generate beautiful README files
        </h1>

        <p className="text-zinc-400 text-lg">
          Turn any GitHub repository into a clean, product-style README with
          badges, features, installation, and usage — automatically.
        </p>

        <button
          onClick={() => setOpen(true)}
          className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-zinc-200 transition"
        >
          Get Started
        </button>
      </div>

      {open && <AuthModal onClose={() => setOpen(false)} />}
    </main>
  );
}
