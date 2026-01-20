import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { detectProjectType } from "@/lib/analyzer/project-type";
import { generateInstallAndUsage } from "@/lib/readme/install-usage";

import { fetchRepoFiles } from "@/lib/github/repo-files";
import { analyzeRepo } from "@/lib/analyzer";

import { fetchRepoFileContent } from "@/lib/github/repo-content";
import { selectImportantFiles } from "@/lib/analyzer/select-files";

import { groqRewrite } from "@/lib/groq/client";
import { buildGroqPrompt } from "@/lib/readme/groq-prompt";
import { buildReadmeTemplate } from "@/lib/readme/template";
import { generateBadges } from "@/lib/readme/generateBadges";

export async function POST(req: Request) {

  const cookieStore = await cookies();
  const token = cookieStore.get("gh_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { owner, repo } = await req.json();

  if (!owner || !repo) {
    return NextResponse.json(
      { error: "Missing owner or repo" },
      { status: 400 }
    );
  }

  try {
    // 1️⃣ Fetch repo files
    const files = await fetchRepoFiles(owner, repo, token);

    // 2️⃣ Analyze repo
    const analysis = analyzeRepo(files);

    const projectType = detectProjectType(
      files,
      analysis.languages,
      analysis.frameworks
    );

    const { installation, usage } = generateInstallAndUsage(
      projectType,
      files
    );

    // 3️⃣ Select & read important files
    const importantFiles = selectImportantFiles(files);

    const fileContents: Record<string, string> = {};
    for (const path of importantFiles) {
      const content = await fetchRepoFileContent(owner, repo, path, token);
      if (content && content.length <= 4000) {
        fileContents[path] = content;
      }
    }

    // 4️⃣ Tech stack
    const techStack = `- Languages: ${analysis.languages.join(", ") || "None"}
- Frameworks: ${analysis.frameworks.join(", ") || "None"}`;

    console.log("LANGUAGES FOR BADGES:", analysis.languages);
    console.log("FRAMEWORKS FOR BADGES:", analysis.frameworks);


    // 5️⃣ Badges
    const badges = generateBadges(
      analysis.languages,
      analysis.frameworks
    );

    // 6️⃣ AI content
    const aiText = await groqRewrite(
      "You output only valid GitHub-flavored Markdown.",
      buildGroqPrompt(owner, repo, analysis, fileContents)
    );

    const description =
      aiText.match(/## 📄 Description([\s\S]*?)##/i)?.[1]?.trim() ||
      "Description unavailable.";

    const features =
      aiText.match(/## ✨ Features([\s\S]*)/i)?.[1]?.trim() ||
      "- No features listed.";

    // 8️⃣ Final README
    const readme = buildReadmeTemplate({
      title: `${owner}/${repo}`,
      badges,
      description,
      features,
      installation,
      usage,
    });

    return NextResponse.json({ analysis, readme });
  } catch (err) {
    console.error("Generate README error:", err);
    return NextResponse.json(
      { error: "Failed to generate README" },
      { status: 500 }
    );
  }
}
