import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { owner, repo, branch, content, message } = await req.json();
  const cookieStore = await cookies();
  const token = cookieStore.get("gh_token")?.value;


  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const encodedContent = Buffer.from(content).toString("base64");

  const fileRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/README.md?ref=${branch}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  let sha: string | undefined;
  if (fileRes.ok) {
    const fileData = await fileRes.json();
    sha = fileData.sha;
  }

  const commitRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/README.md`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
      body: JSON.stringify({
        message: message || "Add generated README",
        content: encodedContent,
        branch,
        ...(sha ? { sha } : {}),
      }),
    }
  );
  console.log("Commit payload:", { owner, repo, branch });


  const text = await commitRes.text();
console.log("GitHub commit response status:", commitRes.status);
console.log("GitHub commit response:", text);

if (!commitRes.ok) {
  return NextResponse.json(
    { error: text },
    { status: commitRes.status }
  );
}


  return NextResponse.json({ success: true });
}
