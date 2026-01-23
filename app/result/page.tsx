"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import ResultActions from "@/components/ResultActions";
import { getReadme } from "@/lib/store/readmeStore";
import remarkGfm from "remark-gfm";

type Data = {
  owner: string;
  repo: string;
  content: string;
};

export default function ResultPage() {
  const router = useRouter();
  const [data, setData] = useState<Data | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const stored = getReadme();

    if (stored) {
      setData(stored);
    }

    setChecked(true);
  }, []);

  useEffect(() => {
    if (checked && !data) {
      router.replace("/dashboard");
    }
  }, [checked, data, router]);

  if (!checked) return null;
  if (!data) return null;

  const { owner, repo, content } = data;

  return (
    <main className="p-10 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">
        {owner}/{repo}
      </h1>

      <div className="prose max-w-none border border-zinc-800 rounded-lg p-6 bg-black text-white">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>

      <ResultActions owner={owner} repo={repo} readme={content} />
    </main>
  );
}
