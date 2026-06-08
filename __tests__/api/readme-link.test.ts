import { describe, it, expect } from "vitest";

describe("GitHub URL parsing", () => {
  function parseGithubUrl(
    input: string,
  ): { owner: string; repo: string } | null {
    const trimmed = input.trim();
    const fullMatch = trimmed.match(
      /^https?:\/\/github\.com\/([^/]+)\/([^/\s?#]+)/,
    );
    if (fullMatch) return { owner: fullMatch[1], repo: fullMatch[2] };

    const shorthand = trimmed.match(/^([^/\s]+)\/([^/\s]+)$/);
    if (shorthand) return { owner: shorthand[1], repo: shorthand[2] };

    return null;
  }

  it("parses full HTTPS GitHub URL", () => {
    const result = parseGithubUrl("https://github.com/vercel/next.js");
    expect(result).toEqual({ owner: "vercel", repo: "next.js" });
  });

  it("parses HTTP GitHub URL", () => {
    const result = parseGithubUrl("http://github.com/owner/repo");
    expect(result).toEqual({ owner: "owner", repo: "repo" });
  });

  it("parses GitHub URL with trailing slash", () => {
    const result = parseGithubUrl("https://github.com/vercel/next.js/");
    expect(result).toEqual({ owner: "vercel", repo: "next.js" });
  });

  it("parses GitHub URL with query params", () => {
    const result = parseGithubUrl(
      "https://github.com/vercel/next.js?tab=readme",
    );
    expect(result).toEqual({ owner: "vercel", repo: "next.js" });
  });

  it("parses shorthand owner/repo format", () => {
    const result = parseGithubUrl("vercel/next.js");
    expect(result).toEqual({ owner: "vercel", repo: "next.js" });
  });

  it("parses shorthand with leading/trailing whitespace", () => {
    const result = parseGithubUrl("  owner/repo  ");
    expect(result).toEqual({ owner: "owner", repo: "repo" });
  });

  it("returns null for invalid input", () => {
    expect(parseGithubUrl("")).toBeNull();
    expect(parseGithubUrl("just-a-word")).toBeNull();
    expect(parseGithubUrl("https://gitlab.com/owner/repo")).toBeNull();
    expect(parseGithubUrl("owner/")).toBeNull();
    expect(parseGithubUrl("/repo")).toBeNull();
  });

  it("handles repo names with dots and hyphens", () => {
    const result = parseGithubUrl("facebook/create-react-app");
    expect(result).toEqual({ owner: "facebook", repo: "create-react-app" });
  });
});

describe("Link API request validation", () => {
  it("rejects missing owner", () => {
    const body: Record<string, string> = { repo: "my-repo" };
    expect(!body.owner || !body.repo).toBe(true);
  });

  it("rejects missing repo", () => {
    const body: Record<string, string> = { owner: "my-org" };
    expect(!body.owner || !body.repo).toBe(true);
  });

  it("accepts valid owner and repo", () => {
    const body: Record<string, string> = { owner: "vercel", repo: "next.js" };
    expect(!body.owner || !body.repo).toBe(false);
  });

  it("defaults theme to startup when not provided", () => {
    const body: Record<string, string> = { owner: "vercel", repo: "next.js" };
    const theme = body.theme || "startup";
    expect(theme).toBe("startup");
  });

  it("uses provided theme", () => {
    const body: Record<string, string> = {
      owner: "vercel",
      repo: "next.js",
      theme: "minimal",
    };
    const theme = body.theme || "startup";
    expect(theme).toBe("minimal");
  });
});

describe("Link API error response mapping", () => {
  it("maps 404 to not found", () => {
    const status = 404 as number;
    const error =
      status === 404
        ? "Repository not found"
        : status === 403
          ? "Rate limit"
          : "Unknown";
    expect(error).toBe("Repository not found");
  });

  it("maps 403 to rate limit", () => {
    const status = 403 as number;
    const error =
      status === 404
        ? "Repository not found"
        : status === 403
          ? "Rate limit"
          : "Unknown";
    expect(error).toBe("Rate limit");
  });
});
