import { analyzeRepo } from "../lib/analyzer/index";

const files = [
  "package.json",
  "package-lock.json",
  "src/main.ts",
  "src/App.tsx",
  "vite.config.ts",
];

console.log(analyzeRepo(files));
