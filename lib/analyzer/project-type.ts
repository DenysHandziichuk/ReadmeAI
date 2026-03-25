export function detectProjectType(
  files: string[],
  languages: string[],
  frameworks: string[],
) {
  if (languages.includes("Python")) {
    return "python";
  }

  if (languages.includes("Rust") || files.includes("Cargo.toml")) {
    return "rust";
  }

  if (languages.includes("Go") || files.includes("go.mod")) {
    return "go";
  }

  if (
    frameworks.includes("React") ||
    frameworks.includes("Vite") ||
    frameworks.includes("Next.js") ||
    frameworks.includes("NextJS")
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

  if (files.includes("index.html") || languages.includes("HTML")) {
    return "static";
  }

  return "unknown";
}
