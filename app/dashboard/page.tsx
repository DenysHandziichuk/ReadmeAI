import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import RepoList from "@/components/RepoList";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("gh_token")?.value;

  if (!token) {
    redirect("/login");
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Your Repositories</h1>
      <RepoList />
    </main>
  );
}
