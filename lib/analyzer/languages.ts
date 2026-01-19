export function detectLanguages(files: string[]): string[] {
  const hasArduino = files.some(f => f.endsWith(".ino"));
  const hasCpp = files.some(f => f.endsWith(".cpp"));
  const hasC = files.some(f => f.endsWith(".c"));
  const hasTs = files.some(f => f.endsWith(".ts"));
  const hasJs = files.some(f => f.endsWith(".js"));
  const hasPy = files.some(f => f.endsWith(".py"));
  const hasGo = files.some(f => f.endsWith(".go"));

  // Embedded / Arduino FIRST
  if (hasArduino) {
    return ["Arduino", "C++"];
  }

  // Systems / embedded
  if (hasCpp) {
    return ["C++"];
  }

  if (hasC) {
    return ["C"];
  }

  // Web / scripting
  if (hasTs) return ["TypeScript"];
  if (hasJs) return ["JavaScript"];
  if (hasPy) return ["Python"];
  if (hasGo) return ["Go"];

  return [];
}
