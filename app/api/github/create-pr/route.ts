import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  console.log("🔥 CREATE PR API HIT");

  const cookieStore = await cookies();
  const token = cookieStore.get("gh_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { owner, repo, content } = await req.json();

  if (!owner || !repo || !content) {
    return NextResponse.json(
      { error: "Missing owner/repo/content" },
      { status: 400 },
    );
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
  };

  try {
    const repoRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers },
    );

    const repoData = await repoRes.json();
    const defaultBranch = repoData.default_branch;

    console.log("Default branch:", defaultBranch);

    const refRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${defaultBranch}`,
      { headers },
    );

    const refData = await refRes.json();
    const baseSha = refData.object.sha;

    console.log("Base SHA:", baseSha);

    const newBranch = `readme-ai-${Date.now()}`;

    const createBranchRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/refs`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          ref: `refs/heads/${newBranch}`,
          sha: baseSha,
          credentials: "include",
        }),
      },
    );

    if (!createBranchRes.ok) {
      const err = await createBranchRes.text();
      console.error("Branch create failed:", err);
      throw new Error("Branch creation failed");
    }

    console.log("Branch created:", newBranch);

    let existingSha: string | null = null;

    const existingRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/README.md?ref=${defaultBranch}`,
      { headers },
    );

    if (existingRes.ok) {
      const existingData = await existingRes.json();
      existingSha = existingData.sha;
      console.log("Existing README SHA:", existingSha);
    }

    const commitPayload: any = {
      message: "Add generated README (AI)",
      content: Buffer.from(content).toString("base64"),
      branch: newBranch,
    };

    if (existingSha) {
      commitPayload.sha = existingSha;
    }

    const commitRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/README.md`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify(commitPayload),
        credentials: "include",
      },
    );

    if (!commitRes.ok) {
      const err = await commitRes.text();
      console.error("Commit failed:", err);
      throw new Error("Commit failed");
    }

    console.log("README committed successfully");

    console.log("README committed to branch");

    const prRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls`,
      {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({
          title: "Add AI-generated README",
          head: newBranch,
          base: defaultBranch,
          body: "This PR adds a AI-generated README.",
        }),
      },
    );

    if (!prRes.ok) {
      const err = await prRes.text();
      console.error("PR creation failed:", err);
      throw new Error("PR creation failed");
    }

    const prData = await prRes.json();

    console.log("PR created:", prData.html_url);

    return NextResponse.json({
      success: true,
      prUrl: prData.html_url,
    });
  } catch (err) {
    console.error("PR ERROR:", err);

    return NextResponse.json({ error: "Failed to create PR" }, { status: 500 });
  }
}
