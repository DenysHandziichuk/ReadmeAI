import { detectLanguages } from "./languages";
import { detectFrameworks } from "./frameworks";
import { detectPackageManager } from "./package-manager";
import { detectTools } from "./tools";
import { detectFromPackageJson } from "./packagejson";

export type ProjectMetadata = {
  languages: string[];
  frameworks: string[];
  tools: string[];
  packageManager: string | null;
  license?: string;
};

export function analyzeRepo(
  files: string[],
  fileContents: Record<string, string>,
): ProjectMetadata {
  const languages = detectLanguages(files);
  const frameworks = detectFrameworks(files);
  const tools = detectTools(files);
  const packageManager = detectPackageManager(files);

  
  const licenseFile = files.find(f => 
    f.toLowerCase() === "license" || 
    f.toLowerCase() === "license.md" || 
    f.toLowerCase() === "license.txt"
  );
  
  const pkgContent = fileContents["package.json"];
  let license: string | undefined;
  
  if (pkgContent) {
    try {
      const pkg = JSON.parse(pkgContent);
      license = pkg.license;
    } catch {}
  }

  const pkgTech = pkgContent
    ? detectFromPackageJson(pkgContent)
    : [];

  return {
    languages,
    frameworks: [...new Set([...frameworks, ...pkgTech])],
    tools,
    packageManager,
    license: license || (licenseFile ? "Detected" : undefined),
  };
}
