import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("gh_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
  };

  const orgsRes = await fetch(
    "https://api.github.com/user/orgs?per_page=100",
    { headers },
  );

  if (!orgsRes.ok) {
    const errorText = await orgsRes.text();
    console.error(`GitHub /user/orgs failed: ${orgsRes.status}`, errorText);

    if (orgsRes.status === 403 || orgsRes.status === 401) {
      return NextResponse.json(
        {
          error: "missing_scope",
          message: "Your token does not have the read:org scope. Please re-authenticate to grant access.",
          orgs: [],
        },
        { status: 403 },
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch organizations", details: errorText },
      { status: orgsRes.status },
    );
  }

  let orgs = await orgsRes.json();

  if (!Array.isArray(orgs)) {
    console.error("GitHub /user/orgs returned non-array:", orgs);
    orgs = [];
  }

  if (orgs.length === 0) {
    try {
      const reposRes = await fetch(
        "https://api.github.com/user/repos?per_page=100&sort=updated&affiliation=organization_member",
        { headers },
      );
      if (reposRes.ok) {
        const repos = await reposRes.json();
        const orgOwners = new Map<string, { avatar_url: string; description: string | null }>();
        for (const repo of repos) {
          const login = repo.owner?.login;
          if (login && repo.owner?.type === "Organization" && !orgOwners.has(login)) {
            orgOwners.set(login, {
              avatar_url: repo.owner.avatar_url,
              description: null,
            });
          }
        }
        orgs = Array.from(orgOwners.entries()).map(([login, data]) => ({
          login,
          avatar_url: data.avatar_url,
          description: data.description,
        }));
      }
    } catch {}
  }

  const cleaned = orgs.map((org: { login: string; avatar_url: string; description: string | null }) => ({
    login: org.login,
    avatar_url: org.avatar_url,
    description: org.description,
  }));

  console.log(`Fetched ${cleaned.length} organizations`);
  return NextResponse.json({ orgs: cleaned });
}
