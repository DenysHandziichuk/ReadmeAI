import { config } from "@/lib/config";

export function githubAuthUrl() {
  const params = new URLSearchParams({
    client_id: config.github.clientId,
    redirect_uri: `${config.app.baseUrl}/api/auth/github/callback`,
    scope: "read:user repo read:org",
  });

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}
