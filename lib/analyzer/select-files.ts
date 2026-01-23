export function selectImportantFiles(files: string[]) {
  const important = [
    "package.json",
    "README.md",
    "requirements.txt",
    "pyproject.toml",
    "main.py",
    "index.js",
    "src/main.jsx",
    "src/main.tsx",
    "app/page.tsx",
    "next.config.js",
    "vite.config.js",
  ];

  return important.filter((f) => files.includes(f));
}
