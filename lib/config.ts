function req(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export const config = {
  github: {
    clientId: req("GITHUB_CLIENT_ID"),
    clientSecret: req("GITHUB_CLIENT_SECRET"),
  },
  app: {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
  },
};
