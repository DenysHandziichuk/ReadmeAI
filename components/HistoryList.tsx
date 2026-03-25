"use client";

import { motion } from "framer-motion";
import { useReadmeHistory, setReadme, StoredReadme } from "@/lib/store/readmeStore";
import { useRouter } from "next/navigation";
import { Clock, ChevronRight, Trash2 } from "lucide-react";

export default function HistoryList() {
  const history = useReadmeHistory();
  const router = useRouter();

  if (history.length === 0) return null;

  const handleRestore = (item: StoredReadme) => {
    setReadme(item);
    router.push("/result");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-zinc-500">
        <Clock size={16} />
        <h2 className="text-xs font-bold uppercase tracking-[0.2em]">Recent Workspace History</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {history.map((item, i) => (
          <motion.div
            key={`${item.owner}/${item.repo}-${item.timestamp}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => handleRestore(item)}
            className="group cursor-pointer rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5 transition-all hover:border-zinc-700 hover:bg-zinc-900"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-bold text-zinc-200 group-hover:text-green-400 transition-colors">
                    {item.repo}
                  </h3>
                  <p className="text-[10px] text-zinc-500 font-mono">{item.owner}</p>
                </div>
                <ChevronRight size={16} className="text-zinc-700 group-hover:text-white transition-colors" />
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className="text-[9px] text-zinc-600">
                  {item.timestamp ? new Date(item.timestamp).toLocaleDateString() : 'Recently'}
                </span>
                <div className="flex gap-1">
                   {item.tech?.slice(0, 3).map(t => (
                     <div key={t} className="h-1.5 w-1.5 rounded-full bg-zinc-800" />
                   ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
