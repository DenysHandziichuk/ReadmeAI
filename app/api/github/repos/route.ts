import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("gh_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const res = await fetch(
    "https://api.github.com/user/repos?per_page=100&sort=updated",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    },
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch repositories" },
      { status: 500 },
    );
  }

  const repos = await res.json();

  const cleaned = repos.map((repo: any) => ({
    name: repo.name,
    owner: repo.owner.login,
    private: repo.private,
    description: repo.description,
  }));

  return NextResponse.json({ repos: cleaned });
}
