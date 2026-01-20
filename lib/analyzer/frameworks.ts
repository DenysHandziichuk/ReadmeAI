export function detectFrameworks(files: string[]): string[] {
  const frameworks = new Set<string>();

  const hasSource = files.some(f =>
    f.includes("/src/") ||
    f.startsWith("src/")
  );

  const hasReactSource = files.some(
    f =>
      (f.endsWith(".jsx") || f.endsWith(".tsx")) &&
      (f.includes("/src/") || f.startsWith("src/"))
  );

  const hasViteConfig = files.some(f =>
    f.includes("vite.config")
  );

  const hasPlatformIO = files.includes("platformio.ini");

  if (hasPlatformIO) {
    frameworks.add("PlatformIO");
  }

  if (hasReactSource) {
    frameworks.add("React");
  }

  if (hasViteConfig && hasSource) {
    frameworks.add("Vite");
  }

  return Array.from(frameworks);
}
