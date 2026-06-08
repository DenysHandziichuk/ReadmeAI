import { NextResponse } from "next/server";

import { selectImportantFiles } from "@/lib/analyzer/select-files";
import { analyzeRepo } from "@/lib/analyzer";
import { formatRepoTitle } from "@/lib/readme/formatRepoTitle";
import { nvidiaRewrite } from "@/lib/nvidia/client";
import { buildModeBPrompt } from "@/lib/readme/modeBPrompt";
import { generateBadges } from "@/lib/readme/generateBadges";
import { generateInstallUsage } from "@/lib/readme/installUsage";

const GH_API = "https://api.github.com";

async function ghFetch(path: string): Promise<Response> {
  return fetch(`${GH_API}${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "ReadmeAI",
    },
  });
}

export async function POST(req: Request) {
  const { owner, repo, theme = "startup" } = await req.json();

  if (!owner || !repo) {
    return NextResponse.json(
      { error: "Missing owner or repo" },
      { status: 400 },
    );
  }

  try {
    const [repoRes, treeRes] = await Promise.all([
      ghFetch(`/repos/${owner}/${repo}`),
      ghFetch(`/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`),
    ]);

    if (!repoRes.ok) {
      const status = repoRes.status;
      if (status === 404) {
        return NextResponse.json(
          { error: "Repository not found" },
          { status: 404 },
        );
      }
      if (status === 403) {
        return NextResponse.json(
          {
            error: "GitHub API rate limit exceeded. Sign in for higher limits.",
          },
          { status: 429 },
        );
      }
      return NextResponse.json(
        { error: "Failed to access repository" },
        { status: 502 },
      );
    }

    if (!treeRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch repo file tree" },
        { status: 502 },
      );
    }

    const [repoData, treeData] = await Promise.all([
      repoRes.json(),
      treeRes.json(),
    ]);
    const files: string[] = treeData.tree
      .filter((item: { type: string; path: string }) => item.type === "blob")
      .map((item: { type: string; path: string }) => item.path);

    const importantFiles = selectImportantFiles(files).slice(0, 15);
    const fileContents: Record<string, string> = {};

    const BATCH_SIZE = 5;
    for (let i = 0; i < importantFiles.length; i += BATCH_SIZE) {
      const batch = importantFiles.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map(async (path) => {
          try {
            const contentRes = await ghFetch(
              `/repos/${owner}/${repo}/contents/${path}`,
            );
            if (!contentRes.ok) return;
            const data = await contentRes.json();
            if (!data.content) return;
            const decoded = Buffer.from(data.content, "base64").toString("utf-8");
            if (decoded.length <= 8000) {
              fileContents[path] = decoded;
            }
          } catch {}
        }),
      );
    }

    const fullAnalysis = analyzeRepo(files, fileContents);

    const tech = [
      ...new Set([
        ...fullAnalysis.languages,
        ...fullAnalysis.frameworks,
        ...(fullAnalysis.tools || []),
        ...(fullAnalysis.packageManager ? [fullAnalysis.packageManager] : []),
        ...fullAnalysis.databases,
      ]),
    ];

    const badges = generateBadges(tech);
    const repoUrl = `https://github.com/${owner}/${repo}`;
    const displayTitle = formatRepoTitle(repo);
    const { installation: suggestedInstall } = generateInstallUsage(
      repoUrl,
      fullAnalysis.projectType,
      fullAnalysis.packageManager,
    );

    const aiReadmeBody = await nvidiaRewrite(
      "You output only valid GitHub-flavored Markdown.",
      buildModeBPrompt(
        owner,
        repo,
        displayTitle,
        fullAnalysis.projectType,
        fileContents,
        suggestedInstall,
        theme,
        fullAnalysis,
        false,
      ),
    );

    let finalReadme = aiReadmeBody.replace("{{BADGES}}", badges);

    finalReadme = finalReadme
      .replace("{{BADGES}}", badges)
      .replaceAll("{{REPO_URL}}", repoUrl)
      .replaceAll("{{REPO_NAME}}", repo)
      .replaceAll("{{OWNER}}", owner)
      .replaceAll("{{PORT}}", "3000")
      .trim();

    finalReadme = finalReadme.replaceAll("{{REPO_NAME}}", repo);

    return NextResponse.json({
      readme: finalReadme,
      tech,
      analysis: fullAnalysis,
    });
  } catch (err) {
    console.error("Link README generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate README" },
      { status: 500 },
    );
  }
}
