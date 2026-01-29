"use client";

import ReadmeDemo from "@/components/ReadmeDemo";
import AuthModal from "@/components/AuthModal";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <main className="min-h-screen linear-bg text-white overflow-hidden">

      <section className="flex items-center justify-center px-6 pt-24 pb-20">
        <div className="max-w-4xl text-center space-y-10 relative">

          <div className="absolute inset-0 -z-10 flex justify-center">
            <div className="w-[650px] h-[650px] bg-green-500/10 blur-[130px] rounded-full" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-950 text-sm text-zinc-400"
          >
            🚀 Premium README Generator
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold tracking-tight"
          >
            Generate{" "}
            <span className="text-green-400">Product READMEs</span>
            <br />
            that look like real startups.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed"
          >
            Turn any GitHub repository into a landing-page style README —
            badges, features, install steps, and instant commit or PR support.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 }}
            className="flex justify-center"
          >
            <AuthModal />
          </motion.div>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-10">
          Everything you need for a perfect README
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Product style",
              desc: "No analyzer templates. Pure product landing README output.",
            },
            {
              title: "Badges Included",
              desc: "Auto-injected under the intro. Clean and deterministic.",
            },
            {
              title: "Commit or PR",
              desc: "Push directly to any branch or open a Pull Request instantly.",
            },
          ].map((f) => (
            <motion.div
              key={f.title}
              whileHover={{ scale: 1.03, y: -5 }}
              transition={{ type: "spring", stiffness: 250 }}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 hover:bg-zinc-900"
            >
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="text-sm text-zinc-400 mt-2">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

<section
  id="preview"
  className="max-w-6xl mx-auto px-6 py-20"
>
  <h2 className="text-3xl font-bold mb-6">
    Live Demo Preview
  </h2>

  <p className="text-zinc-400 mb-10 max-w-xl">
    Watch how ReadmeAI turns your repo into a product landing README.
  </p>

  <ReadmeDemo />
</section>

     
      <section className="px-6 py-24 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-4xl font-bold">
            Ready to ship premium READMEs?
          </h2>

          <p className="text-zinc-400 text-lg">
            Connect GitHub and generate your first README in seconds.
          </p>

          <div className="flex justify-center">
            <AuthModal />
          </div>
        </div>
      </section>


      <footer className="border-t border-zinc-800 py-10 text-center text-sm text-zinc-500">
        Built by DenysHandziichuk • 2026
      </footer>
    </main>
  );
}
