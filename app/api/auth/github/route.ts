import { NextResponse } from "next/server";
import { githubAuthUrl } from "@/lib/auth/github";

export async function GET(req: Request) {
  const reauth = new URL(req.url).searchParams.get("reauth") === "true";
  return NextResponse.redirect(githubAuthUrl(reauth));
}
