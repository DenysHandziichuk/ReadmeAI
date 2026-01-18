import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let body;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  console.log("Generate body:", body);

  const { owner, repo } = body;

  if (!owner || !repo) {
    return NextResponse.json(
      { error: "Missing owner or repo", body },
      { status: 400 }
    );
  }

  const readme = `# ${owner}/${repo}

Generated README.
`;

  return NextResponse.json({ readme });
}
