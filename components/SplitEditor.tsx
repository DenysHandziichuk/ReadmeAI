"use client";

import { useState } from "react";
import MarkdownPreview from "./MarkdownPreview";

type SplitEditorProps = {
  content: string;
  onChange: (val: string) => void;
};

export default function SplitEditor({ content, onChange }: SplitEditorProps) {
  return (
    <div className="grid h-[700px] grid-cols-1 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 md:grid-cols-2">
      {}
      <div className="flex flex-col border-r border-zinc-800">
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/50 px-4 py-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Raw Markdown
          </span>
        </div>
        <textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          className="h-full w-full resize-none bg-black p-6 font-mono text-sm text-zinc-300 outline-none focus:ring-1 focus:ring-green-500/30"
          spellCheck={false}
        />
      </div>

      {}
      <div className="flex flex-col bg-zinc-950/50">
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/50 px-4 py-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Live Preview
          </span>
        </div>
        <div className="h-full overflow-y-auto p-2">
          <MarkdownPreview content={content} />
        </div>
      </div>
    </div>
  );
}
