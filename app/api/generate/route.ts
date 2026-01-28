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

/* ✅ Badge injection helper (Mode B rule) */
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
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  const { owner, repo } = await req.json();

  if (!owner || !repo) {
    return NextResponse.json(
      { error: "Missing owner or repo" },
      { status: 400 }
    );
  }

  try {
    /* 1️⃣ Fetch repo file list */
    const files = await fetchRepoFiles(owner, repo, token);

    const importantFiles = selectImportantFiles(files);

const fileContents: Record<string, string> = {};

    /* 2️⃣ Repo analysis (facts only) */
    const analysis = analyzeRepo(files, fileContents);

    const projectType = detectProjectType(
      files,
      analysis.languages,
      analysis.frameworks
    );

    for (const path of importantFiles) {
      const content = await fetchRepoFileContent(owner, repo, path, token);

      if (content && content.length <= 4000) {
        fileContents[path] = content;
      }
    }

    /* 4️⃣ Deterministic badges */
    const tech = [
  ...new Set([
    ...analysis.languages,
    ...analysis.frameworks,
    ...(analysis.tools || []),
    ...(analysis.packageManager ? [analysis.packageManager] : []),
  ]),
];

    const badges = generateBadges(tech);

    /* 5️⃣ AI generates FULL Mode B README body */
    const aiReadmeBody = await groqRewrite(
      "You output only valid GitHub-flavored Markdown.",
      buildModeBPrompt(owner, repo, projectType, fileContents)
    );

    /* 6️⃣ Inject badges AFTER title + short intro */
    let finalReadme = aiReadmeBody.replace("{{BADGES}}", badges);


    /* 7️⃣ Replace placeholders */
    const repoUrl = `https://github.com/${owner}/${repo}`;

 // Replace placeholders first
finalReadme = finalReadme
  .replace("{{BADGES}}", badges)
  .replaceAll("{{REPO_URL}}", repoUrl)
  .replaceAll("{{REPO_NAME}}", repo)
  .replaceAll("{{OWNER}}", owner)
  .replaceAll("{{PORT}}", "3000")
  .trim();




finalReadme = finalReadme.replaceAll("{{REPO_NAME}}", repo);




    /* ✅ Return final README */
    return NextResponse.json({
      analysis,
      readme: finalReadme,
    });
  } catch (err) {
    console.error("Generate README error:", err);

    return NextResponse.json(
      { error: "Failed to generate README" },
      { status: 500 }
    );
  }
}
