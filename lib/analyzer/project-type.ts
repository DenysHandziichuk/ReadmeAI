export function detectProjectType(
  files: string[],
  languages: string[],
  frameworks: string[],
) {
  if (languages.includes("Python")) {
    return "python";
  }

  if (
    frameworks.includes("React") ||
    frameworks.includes("Vite") ||
    frameworks.includes("Next.js")
  ) {
    return "frontend";
  }

  if (
    files.includes("package.json") &&
    !frameworks.includes("React") &&
    !frameworks.includes("Vite")
  ) {
    return "node";
  }

  return "unknown";
}
