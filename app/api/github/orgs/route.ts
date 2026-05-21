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

  let orgs: { login: string; avatar_url: string; description: string | null }[] = [];
  let needsReauth = false;

  // Strategy 1: /user/orgs (requires read:org scope)
  try {
    const orgsRes = await fetch(
      "https://api.github.com/user/orgs?per_page=100",
      { headers },
    );

    const grantedScopes = orgsRes.headers.get("x-oauth-scopes") || "";
    const hasReadOrg = grantedScopes.includes("read:org") || grantedScopes.includes("org");
    console.log(`Token scopes: "${grantedScopes}", hasReadOrg: ${hasReadOrg}`);

    if (orgsRes.ok) {
      const orgsData = await orgsRes.json();
      if (Array.isArray(orgsData)) {
        orgs = orgsData;
        console.log(`/user/orgs returned ${orgs.length} orgs`);
      }
    } else if (orgsRes.status === 403 || orgsRes.status === 401) {
      needsReauth = true;
    }
  } catch (err) {
    console.error("/user/orgs fetch error:", err);
  }

  // Strategy 2: Scan ALL repos the user has access to and extract org owners
  // This discovers orgs even when membership is private/concealed
  if (orgs.length === 0) {
    console.log("Trying all-repos scan for org discovery...");
    try {
      const reposRes = await fetch(
        "https://api.github.com/user/repos?per_page=100&sort=updated&affiliation=owner,collaborator,organization_member&visibility=all",
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
        if (orgOwners.size > 0) {
          orgs = Array.from(orgOwners.entries()).map(([login, data]) => ({
            login,
            avatar_url: data.avatar_url,
            description: data.description,
          }));
          console.log(`Found ${orgs.length} orgs from all-repos scan`);
        }
      } else {
        console.error("All-repos scan failed:", reposRes.status);
      }
    } catch (err) {
      console.error("All-repos scan error:", err);
    }
  }

  // Strategy 3: Public org memberships
  if (orgs.length === 0) {
    console.log("Trying public org memberships...");
    try {
      const userRes = await fetch("https://api.github.com/user", { headers });
      if (userRes.ok) {
        const userData = await userRes.json();
        const username = userData.login;
        const publicOrgsRes = await fetch(
          `https://api.github.com/users/${username}/orgs?per_page=100`,
          { headers },
        );
        if (publicOrgsRes.ok) {
          const publicOrgs = await publicOrgsRes.json();
          if (Array.isArray(publicOrgs) && publicOrgs.length > 0) {
            orgs = publicOrgs;
            console.log(`Found ${orgs.length} orgs from public profile`);
          }
        }
      }
    } catch (err) {
      console.error("Public orgs fallback error:", err);
    }
  }

  // Enrich orgs with description from /orgs/{login} if missing
  const cleaned = await Promise.all(
    orgs.map(async (org) => {
      if (org.description) return org;
      try {
        const orgRes = await fetch(
          `https://api.github.com/orgs/${org.login}`,
          { headers },
        );
        if (orgRes.ok) {
          const data = await orgRes.json();
          return {
            login: org.login,
            avatar_url: data.avatar_url || org.avatar_url,
            description: data.description,
          };
        }
      } catch {}
      return org;
    }),
  );

  console.log(`Final: ${cleaned.length} organizations found`);

  return NextResponse.json({
    orgs: cleaned,
    needsReauth: needsReauth && cleaned.length === 0,
  });
}
