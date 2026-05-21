import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("gh_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const org = searchParams.get("org");

  if (!org) {
    return NextResponse.json({ error: "Missing org parameter" }, { status: 400 });
  }

  try {
    const allRepos: { name: string; owner: { login: string }; private: boolean; description: string | null }[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const res = await fetch(
        `https://api.github.com/orgs/${org}/repos?per_page=100&sort=updated&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
          },
        },
      );

      if (!res.ok) {
        const errorText = await res.text();
        return NextResponse.json(
          { error: "Failed to fetch org repositories", details: errorText },
          { status: res.status },
        );
      }

      const repos = await res.json();
      allRepos.push(...repos);
      hasMore = repos.length === 100;
      page++;
    }

    const cleaned = allRepos.map((repo) => ({
      name: repo.name,
      owner: repo.owner.login,
      private: repo.private,
      description: repo.description,
    }));

    return NextResponse.json({ repos: cleaned });
  } catch (err) {
    console.error(`Failed to fetch repos for org ${org}:`, err);
    return NextResponse.json(
      { error: "Failed to fetch org repositories" },
      { status: 500 },
    );
  }
}
