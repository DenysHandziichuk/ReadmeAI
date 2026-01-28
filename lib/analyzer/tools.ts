export function detectTools(files: string[]): string[] {
  const tools = new Set<string>();

  /* ---------------------------
   Testing Tools
  ---------------------------- */

  // ✅ Jest
  const hasJest = files.some(
    (f) =>
      f.startsWith("jest.config.") ||
      f.includes("__tests__/") ||
      f.startsWith("test/")
  );

  if (hasJest) tools.add("Jest");

  // ✅ Vitest
  const hasVitest = files.some(
    (f) =>
      f.startsWith("vitest.config.") ||
      f.includes("vitest")
  );

  if (hasVitest) tools.add("Vitest");

  // ✅ Playwright
  const hasPlaywright = files.some(
    (f) =>
      f.startsWith("playwright.config.") ||
      f.includes("playwright")
  );

  if (hasPlaywright) tools.add("Playwright");

  /* ---------------------------
   Code Quality Tools
  ---------------------------- */

  // ✅ ESLint
  const hasESLint = files.some(
    (f) =>
      f === ".eslintrc" ||
      f.startsWith(".eslintrc.") ||
      f === "eslint.config.js"
  );

  if (hasESLint) tools.add("ESLint");

  // ✅ Prettier
  const hasPrettier = files.some(
    (f) =>
      f === ".prettierrc" ||
      f.startsWith(".prettierrc.") ||
      f.startsWith("prettier.config.")
  );

  if (hasPrettier) tools.add("Prettier");

  return Array.from(tools);
}
