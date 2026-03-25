import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("gh_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const res = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json({
    name: data.name,
    login: data.login,
    avatar_url: data.avatar_url,
  });
}
