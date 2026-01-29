export function detectFromPackageJson(pkgRaw: string) {
  const tech: string[] = [];

  try {
    const pkg = JSON.parse(pkgRaw);

    const deps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
    };

    if (deps.next) tech.push("NextJS");
    if (deps.react) tech.push("React");
    if (deps.express) tech.push("Express");

    if (deps.tailwindcss) tech.push("TailwindCSS");

    if (deps.eslint) tech.push("ESLint");
    if (deps.prettier) tech.push("Prettier");
    if (deps.jest) tech.push("Jest");
    if (deps.vitest) tech.push("Vitest");
    if (deps.playwright) tech.push("Playwright");

    return tech;
  } catch {
    return [];
  }
}
