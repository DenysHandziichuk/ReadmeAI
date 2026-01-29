export function buildModeBPrompt(
  owner: string,
  repo: string,
  displayTitle: string,
  projectType: string,
  fileContents: Record<string, string>,
) {
  return `
You are a senior developer writing a polished, modern,
landing-page style GitHub README.


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
- Every section heading (##) must start with exactly ONE emoji
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
Include commands + localhost

---

## 🛠️ Tech Stack
ONLY 1–2 sentence summary, no lists, no badge repeats


==============================
PROJECT INFO
==============================



Repo: ${owner}/${repo}
Detected type: ${projectType}

Relevant source context:
${Object.entries(fileContents)
  .map(([path, content]) => {
    return `--- FILE: ${path} ---\n${content.slice(0, 1200)}\n`;
  })
  .join("\n")}

Return ONLY Markdown.
`;
}
