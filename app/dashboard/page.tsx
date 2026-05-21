import { cookies } from "next/headers";
import DashboardClient from "@/components/DashboardClient";
import PageTransition from "@/components/PageTransition";

import { config } from "@/lib/config";

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

  const res = await fetch(`${config.app.baseUrl}/api/github/repos`, {
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
        <DashboardClient personalRepos={repos} />
      </main>
    </PageTransition>
  );
}
