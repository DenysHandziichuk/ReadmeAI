import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { owner, repo } = await req.json();
  const cookieStore = await cookies();
  const token = cookieStore.get("gh_token")?.value;


  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/branches`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch branches" }, { status: 500 });
  }

  const data = await res.json();

  const branches = data.map((b: any) => b.name);
  return NextResponse.json({ branches });
}
