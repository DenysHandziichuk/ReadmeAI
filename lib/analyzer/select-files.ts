const IMPORTANT_FILES: string[] = [
  "package.json",
  "README.md",
  "requirements.txt",
  "pyproject.toml",
  "setup.py",
  "setup.cfg",
  "Pipfile",
  "Pipfile.lock",
  "Cargo.toml",
  "go.mod",
  "Gemfile",
  "composer.json",
  "pom.xml",
  "build.gradle",
  "build.gradle.kts",
  "pubspec.yaml",
  "mix.exs",
  "Package.swift",
  "main.py",
  "app.py",
  "manage.py",
  "index.js",
  "index.ts",
  "src/main.jsx",
  "src/main.tsx",
  "src/index.ts",
  "app/page.tsx",
  "pages/index.tsx",
  "cmd/main.go",
  "main.go",
  "src/main.rs",
  "src/lib.rs",
  "next.config.js",
  "next.config.ts",
  "next.config.mjs",
  "vite.config.js",
  "vite.config.ts",
  "vite.config.mjs",
  "Dockerfile",
  "docker-compose.yml",
  "docker-compose.yaml",
  "Makefile",
  "justfile",
  ".github/workflows/ci.yml",
  ".github/workflows/deploy.yml",
  "vercel.json",
  "netlify.toml",
  "tailwind.config.js",
  "tailwind.config.ts",
];

const IMPORTANT_PATTERNS: RegExp[] = [
  /^\.github\/workflows\/.+\.ya?ml$/,
  /^src\/main\.(py|rs|go|java|kt|js|ts|jsx|tsx)$/,
  /^app\/main\.(py|js|ts)$/,
  /^cmd\/.+\/main\.go$/,
  /^api\/.+\.(py|js|ts|rb|php|go)$/,
  /^server\.(js|ts|py|go|rb)$/,
  /^app\.(js|ts|py|go|rb)$/,
];

export function selectImportantFiles(files: string[]): string[] {
  const selected = new Set<string>();

  for (const f of IMPORTANT_FILES) {
    if (files.includes(f)) selected.add(f);
  }

  for (const pattern of IMPORTANT_PATTERNS) {
    for (const f of files) {
      if (pattern.test(f)) selected.add(f);
    }
  }

  if (!selected.has("Dockerfile")) {
    const dockerVariant = files.find((f) => f.startsWith("Dockerfile"));
    if (dockerVariant) selected.add(dockerVariant);
  }

  const workflowFiles = files.filter((f) => f.startsWith(".github/workflows/"));
  if (workflowFiles.length > 0 && !selected.has(workflowFiles[0])) {
    selected.add(workflowFiles[0]);
  }

  return Array.from(selected);
}
