export type ProjectType =
  | "frontend"
  | "backend"
  | "fullstack"
  | "api"
  | "cli"
  | "library"
  | "monorepo"
  | "mobile"
  | "desktop"
  | "static"
  | "python"
  | "rust"
  | "go"
  | "node"
  | "ruby"
  | "php"
  | "java"
  | "unknown";

export function detectProjectType(
  files: string[],
  languages: string[],
  frameworks: string[],
  fileContents: Record<string, string> = {},
): ProjectType {
  if (files.includes("lerna.json") || files.includes("turbo.json") || files.includes("pnpm-workspace.yaml") || files.includes("nx.json")) {
    return "monorepo";
  }

  if (files.includes("app.json") && files.some((f) => f.includes("expo"))) {
    return "mobile";
  }

  if (files.some((f) => f.endsWith(".dart")) && files.includes("pubspec.yaml")) {
    const pubspec = fileContents["pubspec.yaml"] || "";
    if (pubspec.includes("flutter")) return "mobile";
  }

  if (frameworks.includes("Tauri") || frameworks.includes("Electron") || frameworks.includes("Electron")) {
    return "desktop";
  }

  const hasBackendJS =
    frameworks.includes("Express") ||
    frameworks.includes("Fastify") ||
    frameworks.includes("NestJS");

  const hasFrontend =
    frameworks.includes("React") ||
    frameworks.includes("NextJS") ||
    frameworks.includes("Vue") ||
    frameworks.includes("Angular") ||
    frameworks.includes("Svelte") ||
    frameworks.includes("Nuxt") ||
    frameworks.includes("Astro");

  if (hasFrontend && hasBackendJS) return "fullstack";

  if (frameworks.includes("NextJS")) return "fullstack";

  const pkgContent = fileContents["package.json"] || "";
  if (hasFrontend && !hasBackendJS) {
    if (pkgContent.includes('"next"')) return "fullstack";
    return "frontend";
  }

  if (hasBackendJS && !hasFrontend) {
    const pkg = tryParseJson(pkgContent);
    const scripts = (pkg?.scripts as Record<string, string>) || {};
    if (scripts.start || scripts.dev) {
      if (scripts.start?.includes("node") || scripts.dev?.includes("nodemon") || scripts.dev?.includes("ts-node")) {
        return "api";
      }
    }
    return "backend";
  }

  if (languages.includes("Python")) {
    const mainContent = fileContents["main.py"] || fileContents["app.py"] || "";
    const setupContent = fileContents["setup.py"] || fileContents["setup.cfg"] || "";
    const pyprojectContent = fileContents["pyproject.toml"] || "";

    if (files.includes("manage.py") || frameworks.includes("Django")) return "fullstack";
    if (frameworks.includes("Flask") || frameworks.includes("FastAPI") || frameworks.includes("Starlette")) return "api";

    if (mainContent.includes("argparse") || mainContent.includes("click") || mainContent.includes("typer")) return "cli";
    if (setupContent.includes("entry_points") || setupContent.includes("console_scripts")) return "cli";
    if (pyprojectContent.includes("console_scripts") || pyprojectContent.includes("[project.scripts]")) return "cli";

    if (files.includes("setup.py") || files.includes("setup.cfg") || (files.includes("pyproject.toml") && !files.includes("main.py") && !files.includes("app.py"))) {
      return "library";
    }

    return "python";
  }

  if (languages.includes("Rust") || files.includes("Cargo.toml")) {
    const cargoContent = fileContents["Cargo.toml"] || "";
    if (frameworks.includes("Actix Web") || frameworks.includes("Axum") || frameworks.includes("Rocket") || frameworks.includes("Warp")) return "api";
    if (frameworks.includes("Yew") || frameworks.includes("Leptos") || frameworks.includes("Dioxus")) return "frontend";
    if (frameworks.includes("Tauri")) return "desktop";
    if (cargoContent.includes("clap") || cargoContent.includes("structopt")) return "cli";
    if (cargoContent.includes("[[bin]]")) return "cli";
    if (cargoContent.includes("[lib]")) return "library";
    return "rust";
  }

  if (languages.includes("Go") || files.includes("go.mod")) {
    if (frameworks.includes("Gin") || frameworks.includes("Echo") || frameworks.includes("Fiber") || frameworks.includes("Chi")) return "api";
    if (files.some((f) => f.startsWith("cmd/") && f.includes("main.go"))) {
      const mainGo = fileContents["cmd/main.go"] || "";
      if (mainGo.includes("cobra") || mainGo.includes("urfave/cli")) return "cli";
    }
    if (files.some((f) => f.startsWith("pkg/"))) return "library";
    return "go";
  }

  if (languages.includes("Java") || files.includes("pom.xml") || files.includes("build.gradle")) {
    if (frameworks.includes("Spring")) return "api";
    return "java";
  }

  if (languages.includes("Ruby") || files.includes("Gemfile")) {
    if (frameworks.includes("Rails")) return "fullstack";
    if (frameworks.includes("Sinatra")) return "api";
    return "ruby";
  }

  if (languages.includes("PHP") || files.includes("composer.json")) {
    if (frameworks.includes("Laravel")) return "fullstack";
    return "php";
  }

  if (
    files.includes("package.json") &&
    !frameworks.includes("React") &&
    !frameworks.includes("Vite")
  ) {
    const pkg = tryParseJson(pkgContent);
    const bin = pkg?.bin;
    if (bin) return "cli";
    return "node";
  }

  if (files.includes("index.html") || languages.includes("HTML")) {
    return "static";
  }

  return "unknown";
}

function tryParseJson(raw: string): Record<string, unknown> | null {
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
}
