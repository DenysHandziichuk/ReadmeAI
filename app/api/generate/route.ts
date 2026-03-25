import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { fetchRepoFiles } from "@/lib/github/repo-files";
import { fetchRepoFileContent } from "@/lib/github/repo-content";
import { selectImportantFiles } from "@/lib/analyzer/select-files";
import { analyzeRepo } from "@/lib/analyzer";
import { formatRepoTitle } from "@/lib/readme/formatRepoTitle";
import { detectProjectType } from "@/lib/analyzer/project-type";

import { groqRewrite } from "@/lib/groq/client";
import { buildModeBPrompt } from "@/lib/readme/modeBPrompt";
import { generateBadges } from "@/lib/readme/generateBadges";
import { generateInstallUsage } from "@/lib/readme/installUsage";

function injectBadgesAfterIntro(readme: string, badges: string) {
  const splitIndex = readme.indexOf("\n\n## ");

  if (splitIndex === -1) {
    return `${readme}\n\n${badges}`;
  }

  const intro = readme.slice(0, splitIndex);
  const rest = readme.slice(splitIndex);

  return `${intro}\n\n${badges}\n\n${rest}`;
}

export async function POST(req: Request) {
  console.log("🔥 GENERATE MODE B HIT");

  const cookieStore = await cookies();
  const token = cookieStore.get("gh_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { owner, repo, theme = "startup" } = await req.json();
  const displayTitle = formatRepoTitle(repo);

  if (!owner || !repo) {
    return NextResponse.json(
      { error: "Missing owner or repo" },
      { status: 400 },
    );
  }

  try {
    const files = await fetchRepoFiles(owner, repo, token);

    const importantFiles = selectImportantFiles(files);

    const fileContents: Record<string, string> = {};

    const analysis = analyzeRepo(files, fileContents);

    const projectType = detectProjectType(
      files,
      analysis.languages,
      analysis.frameworks,
    );

    
    await Promise.all(
      importantFiles.map(async (path) => {
        const content = await fetchRepoFileContent(owner, repo, path, token);
        if (content && content.length <= 4000) {
          fileContents[path] = content;
        }
      }),
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
    const { installation: suggestedInstall } = generateInstallUsage(
      repoUrl,
      projectType,
    );

    const aiReadmeBody = await groqRewrite(
      "You output only valid GitHub-flavored Markdown.",
      buildModeBPrompt(
        owner,
        repo,
        displayTitle,
        projectType,
        fileContents,
        suggestedInstall,
        theme,
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
      analysis,
      readme: finalReadme,
      tech,
    });
  } catch (err) {
    console.error("Generate README error:", err);

    return NextResponse.json(
      { error: "Failed to generate README" },
      { status: 500 },
    );
  }
}
