import { config } from "@/lib/config";

const SCOPES = "read:user repo read:org";

export function githubAuthUrl(forceReauth = false) {
  const params = new URLSearchParams({
    client_id: config.github.clientId,
    redirect_uri: `${config.app.baseUrl}/api/auth/github/callback`,
    scope: SCOPES,
  });

  if (forceReauth) {
    params.set("allow_signup", "true");
    params.set("login", "true");
  }

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}
