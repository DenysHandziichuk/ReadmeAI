import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const owner = form.get("owner");
  const repo = form.get("repo");

  if (!owner || !repo) {
    return NextResponse.json(
      { error: "Missing owner or repo" },
      { status: 400 }
    );
  }

  // TEMP README (we’ll replace this with Groq)
  const readme = `# ${owner}/${repo}

This README was generated automatically.

## Description
Project description goes here.

## Installation
\`\`\`bash
npm install
\`\`\`

## Usage
\`\`\`bash
npm run dev
\`\`\`
`;

  return NextResponse.json({ readme });
}
