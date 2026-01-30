"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


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
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-xl">
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

      <div className="h-[420px] overflow-y-auto p-6 font-mono text-sm leading-relaxed">
        {tab === "raw" ? (
          <motion.pre
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="whitespace-pre-wrap text-zinc-300"
          >
            {text}
          </motion.pre>
  ) : (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="markdown-body"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {text}
      </ReactMarkdown>
    </motion.article>
  )}
      </div>
    </div>
  );
}
