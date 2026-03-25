export function detectTools(files: string[]): string[] {
  const tools = new Set<string>();

  const hasJest = files.some(
    (f) =>
      f.startsWith("jest.config.") ||
      f.includes("__tests__/") ||
      f.startsWith("test/"),
  );

  if (hasJest) tools.add("Jest");

  const hasVitest = files.some(
    (f) => f.startsWith("vitest.config.") || f.includes("vitest"),
  );

  if (hasVitest) tools.add("Vitest");

  const hasPlaywright = files.some(
    (f) => f.startsWith("playwright.config.") || f.includes("playwright"),
  );

  if (hasPlaywright) tools.add("Playwright");

  const hasESLint = files.some(
    (f) =>
      f === ".eslintrc" ||
      f.startsWith(".eslintrc.") ||
      f === "eslint.config.js",
  );

  if (hasESLint) tools.add("ESLint");

  const hasPrettier = files.some(
    (f) =>
      f === ".prettierrc" ||
      f.startsWith(".prettierrc.") ||
      f.startsWith("prettier.config."),
  );

  if (hasPrettier) tools.add("Prettier");

  if (files.some(f => f.startsWith(".github/workflows/"))) {
    tools.add("GitHub Actions");
  }

  if (files.some(f => f === "vercel.json" || f.startsWith(".vercel"))) {
    tools.add("Vercel");
  }

  if (files.some(f => f === "netlify.toml" || f.startsWith(".netlify"))) {
    tools.add("Netlify");
  }

  if (files.some(f => f === ".husky/")) {
    tools.add("Husky");
  }

  return Array.from(tools);
}
