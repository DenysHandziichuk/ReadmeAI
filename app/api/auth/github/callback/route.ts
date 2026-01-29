import { NextResponse } from "next/server";
import { config } from "@/lib/config";

export async function GET(req: Request) {
  try {
    const code = new URL(req.url).searchParams.get("code");

    if (!code) {
      console.error("No code in callback");
      return NextResponse.redirect("/login");
    }

    console.log("OAuth code received");

    const tokenRes = await fetch(
      "https://github.com/login/oauth/access_token",
      {
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
      },
    );

    const data = await tokenRes.json();
    console.log("GitHub token response:", data);

    if (!data.access_token) {
      return NextResponse.json(data, { status: 400 });
    }

    const res = NextResponse.redirect(new URL("/dashboard", req.url));
    res.cookies.set("gh_token", data.access_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return res;
  } catch (err) {
    console.error("OAuth callback error:", err);
    return NextResponse.json({ error: "OAuth failed" }, { status: 500 });
  }
}
