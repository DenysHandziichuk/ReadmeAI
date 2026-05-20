import { type ProjectMetadata } from "@/lib/analyzer";

export function generateReadme(
  owner: string,
  repo: string,
  analysis: ProjectMetadata,
): string {
  const { languages, frameworks, packageManager, databases, projectType, hasDocker, hasCI } = analysis;

  const langLine = languages.length ? languages.join(", ") : "Not specified";
  const frameworkLine = frameworks.length ? frameworks.join(", ") : "None";
  const dbLine = databases.length ? databases.join(", ") : "None detected";

  let install = "No installation required.";
  let usage = "See source code for usage.";

  if (packageManager === "poetry") {
    install = "poetry install";
    usage = "poetry run python main.py";
  } else if (packageManager === "pip") {
    install = "pip install -r requirements.txt";
    usage = "python main.py";
  } else if (packageManager === "pipenv") {
    install = "pipenv install";
    usage = "pipenv run python main.py";
  } else if (packageManager === "uv") {
    install = "uv pip install -r requirements.txt";
    usage = "python main.py";
  }

  if (packageManager === "npm") {
    install = "npm install";
    usage = projectType === "frontend" ? "npm run dev" : "npm start";
  } else if (packageManager === "yarn") {
    install = "yarn";
    usage = projectType === "frontend" ? "yarn dev" : "yarn start";
  } else if (packageManager === "pnpm") {
    install = "pnpm install";
    usage = projectType === "frontend" ? "pnpm dev" : "pnpm start";
  } else if (packageManager === "Bun") {
    install = "bun install";
    usage = projectType === "frontend" ? "bun run dev" : "bun start";
  } else if (packageManager === "cargo") {
    install = "cargo build --release";
    usage = "cargo run";
  } else if (packageManager === "go") {
    install = "go build -o app";
    usage = "./app";
  } else if (packageManager === "bundler") {
    install = "bundle install";
    usage = "rails server";
  } else if (packageManager === "composer") {
    install = "composer install";
    usage = "php artisan serve";
  } else if (packageManager === "maven") {
    install = "mvn install";
    usage = "mvn spring-boot:run";
  } else if (packageManager === "gradle") {
    install = "./gradlew build";
    usage = "./gradlew bootRun";
  } else if (frameworks.includes("PlatformIO")) {
    install = "Install PlatformIO (CLI or IDE).";
    usage = "pio run";
  }

  const dockerLine = hasDocker ? "\n- **Containerization:** Docker" : "";
  const ciLine = hasCI ? "\n- **CI/CD:** GitHub Actions" : "";

  return `# ${owner}/${repo}

## Description
This repository contains a ${projectType} project written in **${langLine}**.

## Tech Stack
- **Languages:** ${langLine}
- **Frameworks:** ${frameworkLine}
- **Package Manager:** ${packageManager || "None detected"}
- **Databases:** ${dbLine}${dockerLine}${ciLine}

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
