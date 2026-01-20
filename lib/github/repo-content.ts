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
        Accept: "application/vnd.github.v3.raw",
      },
    }
  );

  if (!res.ok) return null;
  return await res.text();
}
