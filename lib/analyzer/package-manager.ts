export function detectPackageManager(files: string[]): string | null {
  if (files.includes("pnpm-lock.yaml")) return "pnpm";
  if (files.includes("yarn.lock")) return "yarn";
  if (files.includes("package-lock.json")) return "npm";
  if (files.includes("requirements.txt")) return "pip";
  if (files.includes("poetry.lock")) return "poetry";
  return null;
}
