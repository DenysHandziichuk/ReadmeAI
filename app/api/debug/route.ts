import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const token = (await cookies()).get("gh_token")?.value;

  if (!token) {
    return NextResponse.json({ hasToken: false, error: "No gh_token cookie" });
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
  };

  const [userRes, orgsRes, memberReposRes] = await Promise.all([
    fetch("https://api.github.com/user", { headers }),
    fetch("https://api.github.com/user/orgs?per_page=100", { headers }),
    fetch("https://api.github.com/user/repos?per_page=5&sort=updated&affiliation=organization_member", { headers }),
  ]);

  const scopes = userRes.headers.get("x-oauth-scopes") || "none";

  const userData = userRes.ok ? await userRes.json() : { error: userRes.status };
  const orgsData = orgsRes.ok ? await orgsRes.json() : { error: orgsRes.status };
  const memberReposData = memberReposRes.ok ? await memberReposRes.json() : { error: memberReposRes.status };

  return NextResponse.json({
    hasToken: true,
    tokenLength: token.length,
    scopes,
    user: { login: userData.login, name: userData.name },
    orgs: Array.isArray(orgsData) ? orgsData.map((o: any) => ({ login: o.login, id: o.id })) : orgsData,
    orgsCount: Array.isArray(orgsData) ? orgsData.length : 0,
    memberRepos: Array.isArray(memberReposData)
      ? memberReposData.map((r: any) => ({ name: r.full_name, owner: r.owner?.login, ownerType: r.owner?.type }))
      : memberReposData,
    memberReposCount: Array.isArray(memberReposData) ? memberReposData.length : 0,
  });
}
