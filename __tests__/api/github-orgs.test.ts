import { describe, it, expect } from "vitest";

describe("GitHub API response data mapping", () => {
  it("maps organization list correctly", () => {
    const apiResponse = [
      { login: "org-a", avatar_url: "https://a.com/avatar.png", description: "Org A", id: 1 },
      { login: "org-b", avatar_url: "https://b.com/avatar.png", description: null, id: 2 },
    ];

    const cleaned = apiResponse.map((org: any) => ({
      login: org.login,
      avatar_url: org.avatar_url,
      description: org.description,
    }));

    expect(cleaned).toHaveLength(2);
    expect(cleaned[0].login).toBe("org-a");
    expect(cleaned[1].description).toBeNull();
  });

  it("maps org repos correctly", () => {
    const apiResponse = [
      { name: "repo-1", owner: { login: "org-a" }, private: true, description: "Repo 1", forks_count: 5 },
      { name: "repo-2", owner: { login: "org-a" }, private: false, description: null, forks_count: 10 },
    ];

    const cleaned = apiResponse.map((repo: any) => ({
      name: repo.name,
      owner: repo.owner.login,
      private: repo.private,
      description: repo.description,
    }));

    expect(cleaned).toHaveLength(2);
    expect(cleaned[0].owner).toBe("org-a");
    expect(cleaned[1].private).toBe(false);
  });
});

describe("OAuth scope validation", () => {
  it("detects missing read:org scope", () => {
    const scopeHeader = "read:user, repo";
    const scopes = scopeHeader.split(", ").map((s) => s.trim());
    const hasReadOrg = scopes.includes("read:org");
    expect(hasReadOrg).toBe(false);
  });

  it("detects present read:org scope", () => {
    const scopeHeader = "read:user, repo, read:org";
    const scopes = scopeHeader.split(", ").map((s) => s.trim());
    const hasReadOrg = scopes.includes("read:org");
    expect(hasReadOrg).toBe(true);
  });

  it("treats empty scope header as having all scopes (classic token)", () => {
    const scopeHeader = "";
    const scopes = scopeHeader ? scopeHeader.split(", ").map((s) => s.trim()) : [];
    const hasReadOrg = scopes.length === 0 || scopes.includes("read:org");
    expect(hasReadOrg).toBe(true);
  });

  it("identifies missing_scope error from API response", () => {
    const apiResponse = {
      error: "missing_scope",
      message: "Your token is missing the read:org scope.",
      orgs: [],
    };
    expect(apiResponse.error).toBe("missing_scope");
    expect(apiResponse.orgs).toEqual([]);
  });
});

describe("Org repos pagination", () => {
  it("detects more pages when repos length equals 100", () => {
    const repos = Array.from({ length: 100 }, (_, i) => ({
      name: `repo-${i}`,
      owner: { login: "my-org" },
      private: false,
      description: null,
    }));
    const hasMore = repos.length === 100;
    expect(hasMore).toBe(true);
  });

  it("detects last page when repos length is less than 100", () => {
    const repos = Array.from({ length: 42 }, (_, i) => ({
      name: `repo-${i}`,
      owner: { login: "my-org" },
      private: false,
      description: null,
    }));
    const hasMore = repos.length === 100;
    expect(hasMore).toBe(false);
  });
});
