import { cookies } from "next/headers";
import RepoSearch from "@/components/RepoSearch";
import PageTransition from "@/components/PageTransition";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("gh_token")?.value;

  if (!token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-zinc-500">Not authenticated.</p>
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
    <PageTransition>
      <main className="linear-bg min-h-screen bg-black px-6 py-14 pt-24 text-white">
        <div className="mx-auto max-w-5xl space-y-10">
          <div className="space-y-3">
            <h1 className="text-5xl font-bold tracking-tight">
              Choose a Repository
            </h1>

            <p className="max-w-xl text-lg text-zinc-400">
              Select a repo and instantly generate a{" "}
              <span className="font-medium text-white">
                product-style README
              </span>
              .
            </p>
          </div>

          <RepoSearch repos={repos} />
        </div>
      </main>
    </PageTransition>
  );
}
