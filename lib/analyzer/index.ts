import { detectLanguages } from "./languages";
import { detectFrameworks } from "./frameworks";
import { detectPackageManager } from "./package-manager";

export function analyzeRepo(files: string[]) {
  return {
    languages: detectLanguages(files),
    frameworks: detectFrameworks(files),
    packageManager: detectPackageManager(files),
  };
}
