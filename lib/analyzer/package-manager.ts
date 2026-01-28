export function detectPackageManager(files: string[]): string | null {
  if (files.includes("bun.lockb")) return "Bun";
  if (files.includes("pnpm-lock.yaml")) return "pnpm";
  if (files.includes("yarn.lock")) return "yarn";
  if (files.includes("package-lock.json")) return "npm";

  if (files.includes("deno.json") || files.includes("deno.jsonc"))
    return "Deno";

  return null;
}
