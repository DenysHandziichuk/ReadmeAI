import { detectLanguages } from "./languages";
import { detectFrameworks } from "./frameworks";
import { detectPackageManager } from "./package-manager";
import { detectTools } from "./tools";
import { detectFromPackageJson } from "./packagejson";
import { detectDatabases } from "./databases";
import { parsePyProjectToml, parseCargoToml } from "./toml";
import { parseDockerCompose, parseGitHubActions } from "./yaml";
import { parseDockerfile } from "./docker";
import { detectProjectType, type ProjectType } from "./project-type";

export type ProjectMetadata = {
  languages: string[];
  frameworks: string[];
  tools: string[];
  packageManager: string | null;
  databases: string[];
  projectType: ProjectType;
  hasDocker: boolean;
  hasCI: boolean;
  hasCD: boolean;
  license?: string;
};

export function analyzeRepo(
  files: string[],
  fileContents: Record<string, string>,
): ProjectMetadata {
  const languages = detectLanguages(files);
  const frameworks = detectFrameworks(files, fileContents);
  const tools = detectTools(files);
  const packageManager = detectPackageManager(files);
  const databases = detectDatabases(files, fileContents);

  const hasDocker = files.includes("Dockerfile") || files.includes("docker-compose.yml") || files.includes("docker-compose.yaml");

  let hasCI = false;
  let hasCD = false;

  const workflowFiles = files.filter((f) => f.startsWith(".github/workflows/"));
  for (const wf of workflowFiles) {
    const content = fileContents[wf];
    if (content) {
      const info = parseGitHubActions(content);
      if (info.hasCI) hasCI = true;
      if (info.hasCD) hasCD = true;
    }
  }

  if (workflowFiles.length > 0 && !hasCI) hasCI = true;

  const pkgContent = fileContents["package.json"];

  let license: string | undefined;

  if (pkgContent) {
    try {
      const pkg = JSON.parse(pkgContent);
      license = pkg.license;
    } catch {}
  }

  const licenseFile = files.find(
    (f) =>
      f.toLowerCase() === "license" ||
      f.toLowerCase() === "license.md" ||
      f.toLowerCase() === "license.txt",
  );

  const pkgTech = pkgContent ? detectFromPackageJson(pkgContent) : [];

  const tomlFrameworks: string[] = [];
  const pyprojectContent = fileContents["pyproject.toml"];
  if (pyprojectContent) {
    const pyInfo = parsePyProjectToml(pyprojectContent);
    tomlFrameworks.push(...pyInfo.frameworks);
  }

  const cargoContent = fileContents["Cargo.toml"];
  if (cargoContent) {
    const cargoInfo = parseCargoToml(cargoContent);
    tomlFrameworks.push(...cargoInfo.frameworks);
  }

  const dockerComposeContent = fileContents["docker-compose.yml"] || fileContents["docker-compose.yaml"];
  if (dockerComposeContent) {
    const composeInfo = parseDockerCompose(dockerComposeContent);
    if (composeInfo.hasReverseProxy && !frameworks.includes("Nginx") && !frameworks.includes("Traefik") && !frameworks.includes("Caddy")) {
      frameworks.push("Reverse Proxy");
    }
  }

  const dockerfileContent = fileContents["Dockerfile"];
  if (dockerfileContent) {
    parseDockerfile(dockerfileContent);
  }

  const allFrameworks = [...new Set([...frameworks, ...pkgTech, ...tomlFrameworks])];

  const projectType = detectProjectType(files, languages, allFrameworks, fileContents);

  return {
    languages,
    frameworks: allFrameworks,
    tools,
    packageManager,
    databases,
    projectType,
    hasDocker,
    hasCI,
    hasCD,
    license: license || (licenseFile ? "Detected" : undefined),
  };
}
