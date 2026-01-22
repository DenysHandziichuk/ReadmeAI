import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { fetchRepoFiles } from "@/lib/github/repo-files";
import { fetchRepoFileContent } from "@/lib/github/repo-content";
import { selectImportantFiles } from "@/lib/analyzer/select-files";
import { analyzeRepo } from "@/lib/analyzer";
import { detectProjectType } from "@/lib/analyzer/project-type";

import { groqRewrite } from "@/lib/groq/client";
import { buildModeBPrompt } from "@/lib/readme/modeBPrompt";
import { generateBadges } from "@/lib/readme/generateBadges";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("gh_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { owner, repo } = await req.json();
  if (!owner || !repo) {
    return NextResponse.json({ error: "Missing owner or repo" }, { status: 400 });
  }

  try {
    // 1) Fetch repo files
    const files = await fetchRepoFiles(owner, repo, token);

    // 2) Light analysis (context only)
    const analysis = analyzeRepo(files);
    const projectType = detectProjectType(
      files,
      analysis.languages,
      analysis.frameworks
    );

    // 3) Read important file contents
    const importantFiles = selectImportantFiles(files);
    const fileContents: Record<string, string> = {};
    for (const path of importantFiles) {
      const content = await fetchRepoFileContent(owner, repo, path, token);
      if (content && content.length <= 4000) fileContents[path] = content;
    }

    // 4) Deterministic badges (top of README)
    const badges = generateBadges([
      ...analysis.languages,
      ...analysis.frameworks,
    ]);

    // 5) AI writes the ENTIRE README BODY (Mode B)
    const aiReadmeBody = await groqRewrite(
      "You output only valid GitHub-flavored Markdown.",
      buildModeBPrompt(owner, repo, projectType, fileContents)
    );

    // 6) Replace placeholders (facts owned by code)
    const repoUrl = `https://github.com/${owner}/${repo}`;
    // make the badges appear after title and short paragraph, fix
    const finalReadme = `
${badges}

${aiReadmeBody}
`
      .replaceAll("{{REPO_URL}}", repoUrl)
      .replaceAll("{{REPO_NAME}}", repo)
      .replaceAll("{{OWNER}}", owner)
      .replaceAll("{{PORT}}", "3000")
      .trim();

    return NextResponse.json({ readme: finalReadme });
  } catch (err) {
    console.error("Generate README error:", err);
    return NextResponse.json(
      { error: "Failed to generate README" },
      { status: 500 }
    );
  }
}
