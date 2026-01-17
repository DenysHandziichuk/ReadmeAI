import { NextResponse } from "next/server";
import { githubAuthUrl } from "@/lib/auth/github";

export async function GET() {
  return NextResponse.redirect(githubAuthUrl());
}
