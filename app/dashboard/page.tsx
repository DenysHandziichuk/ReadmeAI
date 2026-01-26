import { cookies } from "next/headers";
import RepoSearch from "@/components/RepoSearch";
import PageTransition from "@/components/PageTransition";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("gh_token")?.value;

  if (!token) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
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
    <main className="min-h-screen bg-black text-white px-6 py-14 linear-bg pt-24">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="space-y-3">
          <h1 className="text-5xl font-bold tracking-tight">
            Choose a Repository
          </h1>

          <p className="text-zinc-400 text-lg max-w-xl">
            Select a repo and instantly generate a{" "}
            <span className="text-white font-medium">
              Mode B product-style README
            </span>
            .
          </p>
        </div>

        {/* ✅ Client Component */}
        <RepoSearch repos={repos} />
      </div>
    </main>
    </PageTransition>
  );
}
