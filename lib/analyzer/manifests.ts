export function detectManifests(files: string[]) {
  return {
    hasPackageJson: files.includes("package.json"),
    hasRequirements: files.includes("requirements.txt"),
    hasPyProject: files.includes("pyproject.toml"),
    hasCargo: files.includes("Cargo.toml"),
    hasGoMod: files.includes("go.mod"),
    hasPom: files.includes("pom.xml"),
  };
}
