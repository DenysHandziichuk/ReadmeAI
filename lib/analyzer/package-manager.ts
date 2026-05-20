export function detectPackageManager(files: string[]): string | null {
  if (files.includes("bun.lockb") || files.includes("bun.lock")) return "Bun";
  if (files.includes("pnpm-lock.yaml")) return "pnpm";
  if (files.includes("yarn.lock")) return "yarn";
  if (files.includes("package-lock.json")) return "npm";
  if (files.includes("deno.json") || files.includes("deno.jsonc")) return "Deno";

  if (files.includes("Pipfile") || files.includes("Pipfile.lock")) return "pipenv";
  if (files.includes("poetry.lock") || files.includes("pyproject.toml")) return "poetry";
  if (files.includes("uv.lock")) return "uv";
  if (files.includes("requirements.txt") || files.includes("setup.py") || files.includes("setup.cfg")) return "pip";

  if (files.includes("Cargo.toml")) return "cargo";
  if (files.includes("go.mod")) return "go";
  if (files.includes("Gemfile")) return "bundler";
  if (files.includes("composer.json") && files.includes("composer.lock")) return "composer";
  if (files.includes("pom.xml")) return "maven";
  if (files.includes("build.gradle") || files.includes("build.gradle.kts")) return "gradle";
  if (files.includes("pubspec.yaml") && files.includes("pubspec.lock")) return "pub";
  if (files.includes("mix.exs")) return "mix";

  return null;
}
