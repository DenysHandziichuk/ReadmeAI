export function detectLanguages(files: string[]): string[] {
  const isSourceFile = (f: string) =>
  f.includes("/src/") ||
  f.includes("/app/") ||
  f.includes("/pages/") ||
  f.startsWith("src/") ||
  f.startsWith("app/") ||
  f.startsWith("pages/");

  const hasArduino = files.some(f => f.endsWith(".ino"));
  const hasCpp = files.some(f => f.endsWith(".cpp"));
  const hasC = files.some(f => f.endsWith(".c"));

  const hasTsSource = files.some(
    f =>
      isSourceFile(f) &&
      (f.endsWith(".ts") || f.endsWith(".tsx")) &&
      !f.endsWith(".d.ts")
  );

  const hasJsSource = files.some(
    f =>
      isSourceFile(f) &&
      (f.endsWith(".js") || f.endsWith(".jsx"))
  );

  const hasPy = files.some(f => f.endsWith(".py"));
  const hasGo = files.some(f => f.endsWith(".go"));

  // Embedded FIRST
  if (hasArduino) return ["Arduino", "C++"];
  if (hasCpp) return ["C++"];
  if (hasC) return ["C"];

  // Prefer TypeScript ONLY if used in source
  if (hasTsSource) return ["TypeScript"];
  if (hasJsSource) return ["JavaScript"];

  if (hasPy) return ["Python"];
  if (hasGo) return ["Go"];

  return [];
}
