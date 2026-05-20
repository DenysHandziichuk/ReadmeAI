const EXTENSION_MAP: Record<string, string> = {
  ".ts": "TypeScript",
  ".tsx": "TypeScript",
  ".js": "JavaScript",
  ".jsx": "JavaScript",
  ".py": "Python",
  ".go": "Go",
  ".rs": "Rust",
  ".java": "Java",
  ".kt": "Kotlin",
  ".kts": "Kotlin",
  ".rb": "Ruby",
  ".php": "PHP",
  ".cs": "C#",
  ".c": "C",
  ".cpp": "C++",
  ".h": "C",
  ".hpp": "C++",
  ".swift": "Swift",
  ".m": "Objective-C",
  ".scala": "Scala",
  ".r": "R",
  ".R": "R",
  ".lua": "Lua",
  ".dart": "Dart",
  ".el": "Elixir",
  ".ex": "Elixir",
  ".exs": "Elixir",
  ".hs": "Haskell",
  ".zig": "Zig",
  ".nim": "Nim",
  ".v": "V",
  ".sol": "Solidity",
  ".vue": "Vue",
  ".svelte": "Svelte",
  ".html": "HTML",
  ".css": "CSS",
  ".scss": "CSS",
  ".sass": "CSS",
  ".less": "CSS",
  ".ino": "Arduino",
};

const isSourceFile = (f: string) =>
  f.includes("/src/") ||
  f.includes("/app/") ||
  f.includes("/pages/") ||
  f.includes("/lib/") ||
  f.includes("/cmd/") ||
  f.includes("/pkg/") ||
  f.startsWith("src/") ||
  f.startsWith("app/") ||
  f.startsWith("pages/") ||
  f.startsWith("lib/") ||
  f.startsWith("cmd/") ||
  f.startsWith("pkg/") ||
  f.startsWith("main.") ||
  f.startsWith("index.") ||
  f.startsWith("mod.rs");

const isIgnored = (f: string) =>
  f.includes("node_modules") ||
  f.endsWith(".d.ts") ||
  f.includes("/dist/") ||
  f.includes("/build/") ||
  f.includes("/.next/") ||
  f.includes("/target/") ||
  f.includes("/vendor/") ||
  f.includes("/__pycache__/") ||
  f.includes(".min.");

export function detectLanguages(files: string[]): string[] {
  const langs = new Set<string>();

  const hasManifestGo = files.includes("go.mod");
  const hasManifestRust = files.includes("Cargo.toml") || files.includes("Cargo.lock");
  const hasManifestJava = files.includes("pom.xml") || files.includes("build.gradle") || files.includes("build.gradle.kts");
  const hasManifestRuby = files.includes("Gemfile");
  const hasManifestPHP = files.includes("composer.json");
  const hasManifestDart = files.includes("pubspec.yaml");
  const hasManifestElixir = files.includes("mix.exs");
  const hasManifestSwift = files.includes("Package.swift");

  const hasArduino = files.some((f) => f.endsWith(".ino"));

  if (hasArduino) {
    langs.add("Arduino");
    langs.add("C++");
  }

  if (hasManifestGo) langs.add("Go");
  if (hasManifestRust) langs.add("Rust");
  if (hasManifestJava) langs.add("Java");
  if (hasManifestRuby) langs.add("Ruby");
  if (hasManifestPHP) langs.add("PHP");
  if (hasManifestDart) langs.add("Dart");
  if (hasManifestElixir) langs.add("Elixir");
  if (hasManifestSwift) langs.add("Swift");

  const sourceFiles = files.filter((f) => isSourceFile(f) && !isIgnored(f));
  const allCodeFiles = files.filter((f) => !isIgnored(f));

  const extensionCounts: Record<string, number> = {};
  for (const f of allCodeFiles) {
    const ext = "." + f.split(".").pop();
    if (EXTENSION_MAP[ext]) {
      const lang = EXTENSION_MAP[ext];
      extensionCounts[lang] = (extensionCounts[lang] || 0) + 1;
    }
  }

  for (const f of sourceFiles) {
    const ext = "." + f.split(".").pop();
    if (EXTENSION_MAP[ext]) {
      langs.add(EXTENSION_MAP[ext]);
    }
  }

  const hasHtml = allCodeFiles.some((f) => f.endsWith(".html"));
  const hasCss = allCodeFiles.some((f) => f.endsWith(".css") || f.endsWith(".scss") || f.endsWith(".sass") || f.endsWith(".less"));

  if (hasHtml && !langs.has("TypeScript") && !langs.has("JavaScript")) langs.add("HTML");
  if (hasCss && !langs.has("TypeScript") && !langs.has("JavaScript")) langs.add("CSS");

  if ((hasHtml || hasCss) && (langs.has("TypeScript") || langs.has("JavaScript"))) {
    if (hasHtml) langs.add("HTML");
    if (hasCss) langs.add("CSS");
  }

  if (extensionCounts["C++"] && !langs.has("C++")) langs.add("C++");
  if (extensionCounts["C"] && !langs.has("C") && !langs.has("C++")) langs.add("C");
  if (extensionCounts["Kotlin"] && !langs.has("Kotlin")) langs.add("Kotlin");
  if (extensionCounts["Scala"] && !langs.has("Scala")) langs.add("Scala");
  if (extensionCounts["Swift"] && !langs.has("Swift")) langs.add("Swift");
  if (extensionCounts["R"] && !langs.has("R")) langs.add("R");
  if (extensionCounts["Lua"] && !langs.has("Lua")) langs.add("Lua");
  if (extensionCounts["Solidity"] && !langs.has("Solidity")) langs.add("Solidity");

  return Array.from(langs);
}
