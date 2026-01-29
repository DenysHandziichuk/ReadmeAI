import { detectLanguages } from "./languages";
import { detectFrameworks } from "./frameworks";
import { detectPackageManager } from "./package-manager";
import { detectTools } from "./tools";
import { detectFromPackageJson } from "./packagejson";

export function analyzeRepo(
  files: string[],
  fileContents: Record<string, string>
) {
  const languages = detectLanguages(files);
  const frameworks = detectFrameworks(files);
  const tools = detectTools(files);
  const packageManager = detectPackageManager(files);

  const pkgTech = fileContents["package.json"]
    ? detectFromPackageJson(fileContents["package.json"])
    : [];

  return {
    languages,
    frameworks: [...new Set([...frameworks, ...pkgTech])],
    tools,
    packageManager,
  };
}

