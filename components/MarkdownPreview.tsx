"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownPreview({
  content,
}: {
  content: string;
}) {
  return (
    <div className="markdown-body p-8 overflow-y-auto max-h-[80vh]">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
