export async function fetchRepoFileContent(
  owner: string,
  repo: string,
  path: string,
  token: string
): Promise<string | null> {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  if (!res.ok) return null;

  const data = await res.json();

  // GitHub returns base64 file content
  if (!data.content) return null;

  const decoded = Buffer.from(data.content, "base64").toString("utf-8");

  return decoded;
}
