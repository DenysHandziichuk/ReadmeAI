import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("gh_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  return NextResponse.json({
    message: "Settings are managed client-side via localStorage",
  });
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("gh_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (
      !Array.isArray(body.allowedOrgs) ||
      typeof body.shareRepos !== "boolean"
    ) {
      return NextResponse.json(
        { error: "Invalid settings format. Required: { allowedOrgs: string[], shareRepos: boolean }" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      settings: {
        allowedOrgs: body.allowedOrgs,
        shareRepos: body.shareRepos,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
}
