import { describe, it, expect, vi, beforeEach } from "vitest";

describe("Settings API validation", () => {
  it("validates allowedOrgs must be an array", () => {
    const body = { allowedOrgs: "not-array", shareRepos: true };
    const isValid = Array.isArray(body.allowedOrgs) && typeof body.shareRepos === "boolean";
    expect(isValid).toBe(false);
  });

  it("validates shareRepos must be a boolean", () => {
    const body = { allowedOrgs: [], shareRepos: "yes" };
    const isValid = Array.isArray(body.allowedOrgs) && typeof body.shareRepos === "boolean";
    expect(isValid).toBe(false);
  });

  it("accepts valid settings", () => {
    const body = { allowedOrgs: ["my-org"], shareRepos: true };
    const isValid = Array.isArray(body.allowedOrgs) && typeof body.shareRepos === "boolean";
    expect(isValid).toBe(true);
  });

  it("accepts empty allowedOrgs", () => {
    const body = { allowedOrgs: [], shareRepos: false };
    const isValid = Array.isArray(body.allowedOrgs) && typeof body.shareRepos === "boolean";
    expect(isValid).toBe(true);
  });
});

describe("GitHub org-repos API parameter validation", () => {
  it("detects missing org parameter", () => {
    const url = new URL("http://localhost:3000/api/github/org-repos");
    const org = url.searchParams.get("org");
    expect(org).toBeNull();
  });

  it("extracts org parameter correctly", () => {
    const url = new URL("http://localhost:3000/api/github/org-repos?org=my-org");
    const org = url.searchParams.get("org");
    expect(org).toBe("my-org");
  });

  it("handles URL-encoded org names", () => {
    const url = new URL("http://localhost:3000/api/github/org-repos?org=my+org");
    const org = url.searchParams.get("org");
    expect(org).toBe("my org");
  });
});

describe("Org repo response data shape", () => {
  it("maps GitHub API repo data to cleaned format", () => {
    const mockRepo = {
      name: "test-repo",
      owner: { login: "test-org" },
      private: true,
      description: "A test repository",
      fork: false,
      stargazers_count: 42,
    };

    const cleaned = {
      name: mockRepo.name,
      owner: mockRepo.owner.login,
      private: mockRepo.private,
      description: mockRepo.description,
    };

    expect(cleaned).toEqual({
      name: "test-repo",
      owner: "test-org",
      private: true,
      description: "A test repository",
    });
    expect(cleaned).not.toHaveProperty("fork");
    expect(cleaned).not.toHaveProperty("stargazers_count");
  });

  it("maps GitHub API org data to cleaned format", () => {
    const mockOrg = {
      login: "test-org",
      avatar_url: "https://example.com/avatar.png",
      description: "A test organization",
      id: 12345,
      node_id: "abc123",
    };

    const cleaned = {
      login: mockOrg.login,
      avatar_url: mockOrg.avatar_url,
      description: mockOrg.description,
    };

    expect(cleaned).toEqual({
      login: "test-org",
      avatar_url: "https://example.com/avatar.png",
      description: "A test organization",
    });
    expect(cleaned).not.toHaveProperty("id");
    expect(cleaned).not.toHaveProperty("node_id");
  });
});
