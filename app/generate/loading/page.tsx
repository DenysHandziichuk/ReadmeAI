"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setReadme } from "@/lib/store/readmeStore";
import SkeletonReadme from "@/components/SkeletonReadme";
import MarkdownPreview from "@/components/MarkdownPreview";
import { motion } from "framer-motion";

export default function LoadingPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [streamingContent, setStreamingContent] = useState("");
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const owner = params.get("owner");
    const repo = params.get("repo");
    const theme = params.get("theme") || "startup";

    if (!owner || !repo) {
      router.replace("/dashboard");
      return;
    }

    async function generate() {
      try {
        const res = await fetch("/api/generate/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ owner, repo, theme }),
        });

        if (!res.body) throw new Error("No body");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let fullContent = "";
        let metadata: any = null;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n\n");

          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const json = JSON.parse(line);
              if (json.type === "metadata") {
                metadata = json;
              } else if (json.type === "content") {
                fullContent += json.content;
                setStreamingContent(fullContent);
              }
            } catch (e) {}
          }
        }

        setReadme({
          owner: owner as string,
          repo: repo as string,
          content: fullContent,
          tech: metadata?.tech || [],
          theme: theme as any,
        });

        setIsFinished(true);
        setTimeout(() => router.replace("/result"), 500);
      } catch (err) {
        console.error(err);
        router.replace("/dashboard");
      }
    }

    generate();
  }, [params, router]);

  return (
    <main className="flex min-h-screen bg-black px-6 py-20 text-white">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            {isFinished ? "README Ready! ✨" : "Crafting your README..."}
          </h1>
          <p className="mt-2 text-zinc-500">
            {isFinished ? "Redirecting to workspace..." : "Real-time AI generation in progress"}
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          {}
          <div className="space-y-6">
             <div className="rounded-3xl border border-zinc-800 bg-zinc-950/50 p-8">
                <SkeletonReadme />
             </div>
          </div>

          {}
          <div className="relative h-[600px] overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl">
            <div className="absolute inset-x-0 top-0 z-10 border-b border-zinc-800 bg-zinc-900/80 px-6 py-3 backdrop-blur">
               <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Live Stream Output</span>
               </div>
            </div>
            <div className="h-full overflow-y-auto p-8 pt-16">
              {streamingContent ? (
                <MarkdownPreview content={streamingContent} />
              ) : (
                <div className="flex h-full items-center justify-center text-zinc-700 italic text-sm">
                  Waiting for Llama to respond...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
