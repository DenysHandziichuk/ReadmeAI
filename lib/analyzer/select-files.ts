export function selectImportantFiles(files: string[]): string[] {
  const candidates = [
    "package.json",
    "README.md",
    "index.js",
    "main.js",
    "src/index.js",
    "src/main.js",
  ];

  return candidates.filter(file => files.includes(file));
}
