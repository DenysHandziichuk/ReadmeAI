type Analysis = {
  languages: string[];
  frameworks: string[];
  packageManager: string | null;
};

export function generateReadme(
  owner: string,
  repo: string,
  analysis: Analysis,
): string {
  const { languages, frameworks, packageManager } = analysis;

  const langLine = languages.length ? languages.join(", ") : "Not specified";

  const frameworkLine = frameworks.length ? frameworks.join(", ") : "None";

  let install = "No installation required.";
  let usage = "See source code for usage.";

  if (packageManager === "pip") {
    install = "pip install -r requirements.txt";
    usage = "python main.py";
  } else if (packageManager === "poetry") {
    install = "poetry install";
    usage = "poetry run python main.py";
  }

  if (packageManager === "npm") {
    install = "npm install";
    usage = "npm run dev";
  } else if (packageManager === "yarn") {
    install = "yarn";
    usage = "yarn dev";
  } else if (frameworks.includes("PlatformIO")) {
    install = "Install PlatformIO (CLI or IDE).";
    usage = "pio run";
  }

  return `# ${owner}/${repo}

## Description
This repository contains a project written in **${langLine}**.

## Tech Stack
- **Languages:** ${langLine}
- **Frameworks:** ${frameworkLine}

## Installation
\`\`\`bash
${install}
\`\`\`

## Usage
\`\`\`bash
${usage}
\`\`\`
`;
}
