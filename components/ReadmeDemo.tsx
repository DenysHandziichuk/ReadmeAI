"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const demoMarkdown = `# ⚡ README Generator

🚀 Product-style README in seconds.

---

## ✨ Features

- Clean landing-page structure  
- Badges injected automatically  
- Installation + Usage written by AI  
- Commit directly or open a PR  

---

## 📦 Install

\`\`\`bash
npm install
npm run dev
\`\`\`

---

## 🚀 Deploy

Push instantly to GitHub with one click.
`;

export default function ReadmeDemo() {
  const [text, setText] = useState("");
  const [tab, setTab] = useState<"raw" | "preview">("raw");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(demoMarkdown.slice(0, i));
      i++;
      if (i > demoMarkdown.length) clearInterval(interval);
    }, 15);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-xl">

      <div className="flex border-b border-zinc-800">
        {["raw", "preview"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            className={`flex-1 py-3 text-sm font-medium transition ${
              tab === t
                ? "bg-zinc-900 text-white"
                : "text-zinc-500 hover:text-white"
            }`}
          >
            {t === "raw" ? "Markdown" : "Preview"}
          </button>
        ))}
      </div>

      <div className="p-6 h-[420px] overflow-y-auto font-mono text-sm leading-relaxed">
        {tab === "raw" ? (
          <motion.pre
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="whitespace-pre-wrap text-zinc-300"
          >
            {text}
          </motion.pre>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="prose prose-invert max-w-none"
          >
            <h1>⚡ README Generator</h1>
            <p>🚀 Product-style README in seconds.</p>

            <h2>✨ Features</h2>
            <ul>
              <li>Clean landing-page structure</li>
              <li>Badges injected automatically</li>
              <li>Install + Usage written by AI</li>
              <li>Commit or Pull Request support</li>
            </ul>

            <h2>📦 Install</h2>
            <pre>
              <code>npm install{"\n"}npm run dev</code>
            </pre>

            <h2>🚀 Deploy</h2>
            <p>Push instantly to GitHub with one click.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
