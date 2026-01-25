import Link from "next/link";
import { cookies } from "next/headers";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("gh_token")?.value;

  if (!token) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-400">Not authenticated.</p>
      </main>
    );
  }

  const res = await fetch("http://localhost:3000/api/github/repos", {
    headers: {
      Cookie: `gh_token=${token}`,
    },
    cache: "no-store",
  });

  const data = await res.json();
  const repos = data.repos || [];

  return (
    <main className="min-h-screen bg-black text-white px-6 py-14">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Choose a Repository
          </h1>

          <p className="text-zinc-400 text-lg">
            Select a repo and generate a Mode B product-style README.
          </p>
        </div>

        {/* Repo List */}
        <div className="grid gap-4">
          {repos.map((repo: any) => (
            <Link
              key={`${repo.owner.login}/${repo.name}`}
              href={`/dashboard/${repo.owner}/${repo.name}`}
              className="group block border border-zinc-800 rounded-xl p-5 hover:bg-zinc-900 transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold group-hover:text-white">
                    {repo.name}
                  </h2>

                  <p className="text-sm text-zinc-500">
                    {repo.private ? "🔒 Private" : "🌍 Public"} • ⭐{" "}
                    {repo.stargazers_count}
                  </p>
                </div>

                <span className="text-zinc-600 group-hover:text-white transition">
                  →
                </span>
              </div>

              {repo.description && (
                <p className="mt-3 text-zinc-400 text-sm line-clamp-2">
                  {repo.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
