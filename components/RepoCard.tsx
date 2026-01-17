import Link from "next/link";

export default function RepoCard({
  repo,
}: {
  repo: { owner: string; name: string };
}) {
  return (
    <Link
      href={`/dashboard/${repo.owner}/${repo.name}`}
      className="block border rounded p-3 hover:bg-zinc-100"
    >
      {repo.owner}/{repo.name}
    </Link>
  );
}
