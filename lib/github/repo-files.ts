export async function fetchRepoFiles(
  owner: string,
  repo: string,
  token: string
): Promise<string[]> {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch repo tree");
  }

  const data = await res.json();

  return data.tree
    .filter((item: any) => item.type === "blob")
    .map((item: any) => item.path);
}
