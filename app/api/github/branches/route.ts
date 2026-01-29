import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("gh_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { owner, repo } = await req.json();

  if (!owner || !repo) {
    return NextResponse.json({ error: "Missing repo info" }, { status: 400 });
  }

  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/branches`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    },
  );

  if (!res.ok) {
    const text = await res.text();

    return NextResponse.json(
      {
        error: "Failed to fetch branches",
        status: res.status,
        details: text,
      },
      { status: res.status },
    );
  }

  const data = await res.json();

  return NextResponse.json({
    branches: data.map((b: any) => b.name),
  });
}
