import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { fetchRepoFiles } from "@/lib/github/repo-files";
import { fetchRepoFileContent } from "@/lib/github/repo-content";
import { selectImportantFiles } from "@/lib/analyzer/select-files";
import { analyzeRepo } from "@/lib/analyzer";
import { formatRepoTitle } from "@/lib/readme/formatRepoTitle";
import { detectProjectType } from "@/lib/analyzer/project-type";

import { groqStream } from "@/lib/groq/client";
import { buildModeBPrompt } from "@/lib/readme/modeBPrompt";
import { generateBadges } from "@/lib/readme/generateBadges";
import { generateInstallUsage } from "@/lib/readme/installUsage";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("gh_token")?.value;

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { owner, repo, theme = "startup" } = await req.json();
  const displayTitle = formatRepoTitle(repo);

  try {
    const files = await fetchRepoFiles(owner, repo, token);
    const importantFiles = selectImportantFiles(files);
    const fileContents: Record<string, string> = {};

    const analysis = analyzeRepo(files, fileContents);
    const projectType = detectProjectType(files, analysis.languages, analysis.frameworks);

    await Promise.all(
      importantFiles.map(async (path) => {
        const content = await fetchRepoFileContent(owner, repo, path, token);
        if (content && content.length <= 4000) {
          fileContents[path] = content;
        }
      })
    );

    const tech = [
      ...new Set([
        ...analysis.languages,
        ...analysis.frameworks,
        ...(analysis.tools || []),
        ...(analysis.packageManager ? [analysis.packageManager] : []),
      ]),
    ];

    const badges = generateBadges(tech);
    const repoUrl = `https://github.com/${owner}/${repo}`;
    const { installation: suggestedInstall } = generateInstallUsage(repoUrl, projectType);

    const stream = await groqStream(
      "You output only valid GitHub-flavored Markdown.",
      buildModeBPrompt(owner, repo, displayTitle, projectType, fileContents, suggestedInstall, theme)
    );

    if (!stream) throw new Error("No stream body");

    
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        
        controller.enqueue(encoder.encode(JSON.stringify({ 
          type: "metadata", 
          tech, 
          analysis 
        }) + "\n\n"));

        const reader = stream.getReader();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;
              try {
                const json = JSON.parse(data);
                const content = json.choices[0]?.delta?.content || "";
                if (content) {
                  controller.enqueue(encoder.encode(JSON.stringify({ 
                    type: "content", 
                    content 
                  }) + "\n\n"));
                }
              } catch (e) {}
            }
          }
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (err) {
    console.error("Stream error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
