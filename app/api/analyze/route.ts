import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generateReadme } from "@/lib/readme/generator";
import { fetchRepoFiles } from "@/lib/github/repo-files";
import { analyzeRepo } from "@/lib/analyzer";
import { fetchRepoFileContent } from "@/lib/github/repo-content";
import { selectImportantFiles } from "@/lib/analyzer/select-files";

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
      { status: 400 },
    );
  }

  try {
    const files = await fetchRepoFiles(owner, repo, token);

    const importantFiles = selectImportantFiles(files);

    const fileContents: Record<string, string> = {};

    for (const path of importantFiles) {
      const content = await fetchRepoFileContent(owner, repo, path, token);
      if (content && content.length < 4000) {
        fileContents[path] = content;
      }
    }

    const analysis = analyzeRepo(files, fileContents);

    const readme = generateReadme(owner, repo, analysis);

    return NextResponse.json({
      readme,
    });
  } catch (err) {
    console.error("Generate README error:", err);
    return NextResponse.json(
      { error: "Failed to generate README" },
      { status: 500 },
    );
  }
}
