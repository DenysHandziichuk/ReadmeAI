export function buildModeBPrompt(
  owner: string,
  repo: string,
  projectType: string,
  fileContents: Record<string, string>
) {
  return `
You are a senior developer writing a polished, modern,
landing-page style GitHub README.

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
- 📝 Feature
- ⚡ Feature

---

## 🧭 Simple Workflow
1. Step one
2. Step two
3. Step three

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
