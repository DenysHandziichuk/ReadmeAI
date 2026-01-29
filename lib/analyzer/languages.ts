export function detectLanguages(files: string[]): string[] {
  const isJsTsSource = (f: string) =>
    f.includes("/src/") ||
    f.includes("/app/") ||
    f.includes("/pages/") ||
    f.startsWith("src/") ||
    f.startsWith("app/") ||
    f.startsWith("pages/");

  const isIgnored = (f: string) =>
    f.includes("node_modules") ||
    f.endsWith(".d.ts") ||
    f.includes(".config.") ||
    f.includes("vite.config") ||
    f.includes("webpack") ||
    f.includes("eslint") ||
    f.includes("tsconfig") ||
    f.includes("/dist/") ||
    f.includes("/build/");

  const hasHtml = files.some(f => f.endsWith(".html"));
  const hasCss = files.some(f =>
    f.endsWith(".css") || f.endsWith(".scss")
  );

  const sourceFiles = files.filter(
    f => isJsTsSource(f) && !isIgnored(f)
  );

  const hasTs = sourceFiles.some(
    f => f.endsWith(".ts") || f.endsWith(".tsx")
  );

  const hasJs = sourceFiles.some(
    f => f.endsWith(".js") || f.endsWith(".jsx")
  );

  const hasArduino = sourceFiles.some(f => f.endsWith(".ino"));
  const hasCpp = sourceFiles.some(f => f.endsWith(".cpp"));
  const hasC = sourceFiles.some(f => f.endsWith(".c"));
  const hasPy = sourceFiles.some(f => f.endsWith(".py"));
  const hasGo = sourceFiles.some(f => f.endsWith(".go"));

  if (hasArduino) return ["Arduino", "C++"];
  if (hasCpp) return ["C++"];
  if (hasC) return ["C"];

  if ((hasHtml || hasCss) && !hasJs && !hasTs) {
    const langs: string[] = [];
    if (hasHtml) langs.push("HTML");
    if (hasCss) langs.push("CSS");
    return langs;
  }

  if (hasTs) return ["TypeScript"];
  if (hasJs) {
    const langs: string[] = [];
    if (hasHtml) langs.push("HTML");
    if (hasCss) langs.push("CSS");
    langs.push("JavaScript");
    return langs;
  }

  if (hasPy) return ["Python"];
  if (hasGo) return ["Go"];

  return [];
}
