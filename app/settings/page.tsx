import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SettingsPageClient from "@/components/SettingsPage";
import PageTransition from "@/components/PageTransition";

export default async function SettingsPageRoute() {
  const cookieStore = await cookies();
  const token = cookieStore.get("gh_token")?.value;

  if (!token) {
    redirect("/login");
  }

  return (
    <PageTransition>
      <SettingsPageClient />
    </PageTransition>
  );
}
