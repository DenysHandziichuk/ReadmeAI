import { type ProjectMetadata } from "@/lib/analyzer";

export function buildModeBPrompt(
  owner: string,
  repo: string,
  displayTitle: string,
  projectType: string,
  fileContents: Record<string, string>,
  suggestedInstall: string = "",
  theme: string = "startup",
  analysis?: ProjectMetadata,
  isOrgRepo: boolean = false,
) {
  const themeInstructions = {
    startup: "Heavy on emojis, marketing-focused, catchy headings, and a high-energy tone. Every section heading MUST start with exactly one emoji.",
    minimal: "Clean, concise, very few emojis, focused strictly on utility and direct information. Maintain a professional and lean tone.",
    enterprise: "Formal tone, comprehensive sections, detailed documentation, and structured for stability. Avoid excessive emojis, use professional language.",
  }[theme as "startup" | "minimal" | "enterprise"] || "Standard professional tone.";

  const analysisSection = analysis ? `
=============================
DETECTED PROJECT ANALYSIS
=============================

Languages: ${analysis.languages.join(", ")}
Frameworks: ${analysis.frameworks.join(", ")}
Tools: ${analysis.tools.join(", ")}
Package Manager: ${analysis.packageManager || "None detected"}
Databases: ${analysis.databases.join(", ") || "None detected"}
Project Type: ${analysis.projectType}
Has Docker: ${analysis.hasDocker ? "Yes" : "No"}
Has CI/CD: ${analysis.hasCI ? "CI" : ""}${analysis.hasCD ? "/CD" : ""}
License: ${analysis.license || "Not detected"}

IMPORTANT: Use the analysis above to write an accurate and specific README.
- If frameworks are detected, mention them by name in the Tech Stack section
- If databases are detected, mention the database technology used
- If Docker is detected, mention containerization in the setup
- If CI/CD is detected, mention the automation pipeline
- Use the project type to determine the correct installation steps
` : "";

  return `
You are a senior developer writing a polished, modern,
landing-page style GitHub README.

THEME: ${theme.toUpperCase()}
TONE INSTRUCTIONS: ${themeInstructions}

PROJECT NAME RULE:
- The project is named: "${displayTitle}"
- NEVER call it "my-app"
- NEVER use any other name
- Replace all mentions with "${displayTitle}"

## 🧭 Simple Workflow

WORKFLOW RULES:
- This section explains how a USER uses the website/app
- Do NOT mention installation, cloning, dependencies, or terminal commands
- Do NOT include: git clone, npm, yarn, localhost
- Use a numbered list with as many steps as needed (3–7 typical)
- Steps should describe the UI flow, for example:
- Open the app
- Paste input or select a repo
- Adjust settings
- Generate the output
- Copy/export/publish results


FORBIDDEN IN WORKFLOW SECTION:
- git clone
- npm install
- yarn
- pnpm
- terminal commands
- localhost

The workflow must read like instructions for an end user, not a developer.



==============================
STRICT FORMATTING RULES
==============================

- Output ONLY valid GitHub-flavored Markdown
- Add a blank line between paragraphs
- Insert "---" between every major section
- Do NOT put "---" directly after the title
- Every section heading (##) must start with exactly ONE emoji (if the theme allows it)
- Feature bullets must start with emojis

Badges:
- DO NOT write badges
- Badges will be inserted separately via {{BADGES}}

Installation & Usage:
- ALWAYS include this section
- Write realistic setup steps for the detected project type
- Use fenced bash blocks
- Use placeholders:

git clone {{REPO_URL}}
cd {{REPO_NAME}}

- Include install + run commands
- Mention localhost if applicable


IMPORTANT:
- Badges are already injected by code
- Do NOT include badge markdown
- Do NOT repeat languages/frameworks in Tech Stack


==============================
REQUIRED STRUCTURE (EXACT)
==============================

# 🔥 Project Title

Short description paragraph (2–3 sentences)

{{BADGES}}

---

## ✨ Key Features
Emoji bullet list

---

## 🧭 Simple Workflow
Numbered list

---

## 🎯 Purpose
Short purpose paragraph

---

## 🧩 Installation & Usage
${
  suggestedInstall ||
  "Include commands for cloning, installing dependencies, and running the project."
}

---

## 🛠️ Tech Stack
ONLY 1–2 sentence summary, no lists, no badge repeats

${analysisSection}

==============================
PROJECT INFO
==============================



Repo: ${owner}/${repo}
Detected type: ${projectType}
${isOrgRepo ? `Organization: This is an organization repository owned by ${owner}` : ""}
Suggested baseline install steps:
${suggestedInstall}

Relevant source context:
${Object.entries(fileContents)
  .map(([path, content]) => {
    return `--- FILE: ${path} ---\n${content.slice(0, 2000)}\n`;
  })
  .join("\n")}

Return ONLY Markdown.
`;
}
