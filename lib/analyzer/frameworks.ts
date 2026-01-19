export function detectFrameworks(files: string[]): string[] {
  const frameworks = new Set<string>();

  if (files.includes("next.config.js")) frameworks.add("Next.js");
  if (files.includes("next.config.ts")) frameworks.add("Next.js");

  if (files.some(f => f.startsWith("vite.config"))) frameworks.add("Vite");

  if (files.includes("package.json")) frameworks.add("React");

  if (files.includes("requirements.txt")) frameworks.add("Python");

  if (files.includes("platformio.ini")) frameworks.add("PlatformIO");
  if (files.some(f => f.endsWith(".ino"))) frameworks.add("Arduino");

  if (files.includes("next.config.js") || files.includes("next.config.ts"))
    frameworks.add("Next.js");

  if (files.some(f => f.startsWith("vite.config")))
    frameworks.add("Vite");

  return Array.from(frameworks);
}
