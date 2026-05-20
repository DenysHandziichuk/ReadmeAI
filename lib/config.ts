import { z } from "zod";

const configSchema = z.object({
  github: z.object({
    clientId: z.string(),
    clientSecret: z.string(),
  }),
  nvidia: z.object({
    apiKey: z.string(),
  }),
  app: z.object({
    baseUrl: z.string().url(),
  }),
});

const envConfig = {
  github: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  },
  nvidia: {
    apiKey: process.env.NVIDIA_API_KEY,
  },
  app: {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
  },
};

const parsed = configSchema.safeParse(envConfig);

if (!parsed.success) {
  console.error("❌ Invalid environment configuration:", parsed.error.format());
  throw new Error("Invalid environment configuration");
}

export const config = parsed.data;
