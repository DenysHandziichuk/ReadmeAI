import { NextResponse } from "next/server";
import { config } from "@/lib/config";

export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get("code");

  if (!code) {
    return NextResponse.redirect("/login");
  }

  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: config.github.clientId,
      client_secret: config.github.clientSecret,
      code,
    }),
  });

  const data = await res.json();

  if (!data.access_token) {
    return NextResponse.json(data, { status: 400 });
  }

  const response = NextResponse.redirect("/dashboard");
  response.cookies.set("gh_token", data.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return response;
}
