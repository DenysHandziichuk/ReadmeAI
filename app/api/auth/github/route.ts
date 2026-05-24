import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { config } from "@/lib/config";
import { githubAuthUrl } from "@/lib/auth/github";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("gh_token")?.value;
  const reauth = new URL(req.url).searchParams.get("reauth") === "true";

  if (token && !reauth) {
    return NextResponse.redirect(new URL("/dashboard", config.app.baseUrl));
  }

  return NextResponse.redirect(githubAuthUrl(reauth));
}
