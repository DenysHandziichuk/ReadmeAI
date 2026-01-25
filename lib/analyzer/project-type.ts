export function detectProjectType(
  files: string[],
  languages: string[],
  frameworks: string[]
) {
  // --------------------
  // Python project
  // --------------------
  if (languages.includes("Python")) {
    return "python";
  }

  // --------------------
  // Frontend React/Vite/Next
  // --------------------
  if (
    frameworks.includes("React") ||
    frameworks.includes("Vite") ||
    frameworks.includes("Next.js")
  ) {
    return "frontend";
  }

  // --------------------
  // Node backend
  // --------------------
  if (
    files.includes("package.json") &&
    !frameworks.includes("React") &&
    !frameworks.includes("Vite")
  ) {
    return "node";
  }

  return "unknown";
}
