type Props = {
  params: Promise<{
    owner: string;
    repo: string;
  }>;
};

export default async function RepoPage({ params }: Props) {
  const { owner, repo } = await params;

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        {owner}/{repo}
      </h1>

      <form action="/api/generate" method="POST">
        <input type="hidden" name="owner" value={owner} />
        <input type="hidden" name="repo" value={repo} />

        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded"
        >
          Generate README
        </button>
      </form>
    </main>
  );
}
