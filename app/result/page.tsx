"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Edit3, Eye, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import PageTransition from "@/components/PageTransition";
import SplitEditor from "@/components/SplitEditor";
import TechChips from "@/components/TechChips";
import SuccessCelebration from "@/components/SuccessCelebration";
import ResultActions from "@/components/ResultActions";
import MarkdownPreview from "@/components/MarkdownPreview";

import { useStoredReadme, clearReadme } from "@/lib/store/readmeStore";
import { generateBadges, BADGES_BASE } from "@/lib/readme/generateBadges";

export default function ResultPage() {
  const router = useRouter();
  const stored = useStoredReadme();

  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [branches, setBranches] = useState<string[]>([]);
  const [branch, setBranch] = useState("");
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (stored === null) {
      router.replace("/dashboard");
    } else if (stored) {
      setContent(stored.content);
      setSelectedTech(stored.tech || []);
    }
  }, [stored, router]);

  useEffect(() => {
    if (!stored?.owner || !stored?.repo) return;

    async function loadBranches() {
      try {
        const res = await fetch("/api/github/branches", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            owner: stored?.owner,
            repo: stored?.repo,
          }),
        });
        if (!res.ok) throw new Error("Branches failed");
        const json = await res.json();
        setBranches(json.branches || []);
        setBranch(json.branches?.[0] || "");
      } catch (err) {
        console.error(err);
      }
    }
    loadBranches();
  }, [stored]);

  
  useEffect(() => {
    if (!content) return;

    const newBadges = generateBadges(selectedTech, "for-the-badge");
    
    const lines = content.split("\n");
    const badgeRegex = /!\[.*\]\(https:\/\/img\.shields\.io\/badge\/.*\)/;
    
    let firstBadgeIndex = -1;
    let lastBadgeIndex = -1;

    lines.forEach((line, i) => {
      if (badgeRegex.test(line)) {
        if (firstBadgeIndex === -1) firstBadgeIndex = i;
        lastBadgeIndex = i;
      }
    });

    if (firstBadgeIndex !== -1) {
      const newLines = [
        ...lines.slice(0, firstBadgeIndex),
        newBadges,
        ...lines.slice(lastBadgeIndex + 1)
      ];
      setContent(newLines.join("\n"));
    }
  }, [selectedTech]);

  if (!stored) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-zinc-500">Loading…</p>
      </main>
    );
  }

  const handleToggleTech = (t: string) => {
    setSelectedTech(prev => 
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    );
  };

  const handleAddLicense = (licenseType: string) => {
    const badgePath = BADGES_BASE[licenseType];
    const badgeMarkdown = `![License](https://img.shields.io/badge/${badgePath}?style=for-the-badge)`;
    
    const licenseSection = `
---
## 📄 License
This project is licensed under the ${licenseType} License - see the [LICENSE](LICENSE) file for details.

${badgeMarkdown}
`;
    
    if (content.includes("## 📄 License")) {
      toast.error("License section already exists");
      return;
    }

    setContent(prev => prev + licenseSection);
    toast.success(`${licenseType} License added to bottom`);
  };

  return (
    <PageTransition>
      <main className="min-h-screen bg-black px-6 py-12 pt-24 text-white">
        <SuccessCelebration trigger={success} />
        
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-7xl space-y-8"
        >
          {}
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-zinc-500">
                 <Link href="/dashboard" className="text-xs font-bold uppercase tracking-widest transition hover:text-white">Dashboard</Link>
                 <span>/</span>
                 <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">{stored.owner}</span>
              </div>
              <h1 className="text-5xl font-bold tracking-tight">{stored.repo}</h1>
            </div>

            <div className="flex items-center gap-3">
               <motion.button
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 onClick={() => setIsEditing(!isEditing)}
                 className={`flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-bold transition-all ${
                   isEditing 
                    ? "border-green-500 bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.3)]" 
                    : "border-zinc-800 bg-zinc-900 text-white hover:border-zinc-700"
                 }`}
               >
                 {isEditing ? <Eye size={18} /> : <Edit3 size={18} />}
                 {isEditing ? "Preview Mode" : "Edit Markdown"}
               </motion.button>
            </div>
          </div>

          {}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="sticky top-6 z-40"
          >
            <div className="rounded-[2.5rem] border border-zinc-800 bg-black/90 p-6 shadow-2xl backdrop-blur-xl">
              <ResultActions
                owner={stored.owner}
                repo={stored.repo}
                readme={content}
                branches={branches}
                branch={branch}
                setBranch={setBranch}
                onSuccess={() => setSuccess(true)}
                onAddLicense={handleAddLicense}
              >
                <TechChips 
                  allTech={stored.tech || []}
                  selectedTech={selectedTech}
                  onToggle={handleToggleTech}
                />
              </ResultActions>
            </div>
          </motion.div>

          {}
          <div className="min-h-[600px]">
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SplitEditor content={content} onChange={setContent} />
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 shadow-xl"
                >
                  <MarkdownPreview content={content} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex justify-center pb-10">
            <Link
              href="/dashboard"
              onClick={() => clearReadme()}
              className="flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
            >
              <ChevronLeft size={16} />
              Back to repositories
            </Link>
          </div>
        </motion.div>
      </main>
    </PageTransition>
  );
}
