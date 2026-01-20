export type ProjectType =
  | "frontend"
  | "node"
  | "python"
  | "embedded"
  | "static-web"
  | "unknown";

export function detectProjectType(
  files: string[],
  languages: string[],
  frameworks: string[]
): ProjectType {
  if (frameworks.includes("PlatformIO")) return "embedded";

  if (
    files.includes("index.html") &&
    languages.includes("JavaScript") &&
    !files.includes("package.json")
  ) {
    return "static-web";
  }


  if (files.includes("package.json")) {
    if (
      frameworks.includes("React") ||
      frameworks.includes("Vue") ||
      frameworks.includes("Svelte")
    ) {
      return "frontend";
    }
    return "node";
  }

  if (languages.includes("Python")) return "python";

  return "unknown";
}
