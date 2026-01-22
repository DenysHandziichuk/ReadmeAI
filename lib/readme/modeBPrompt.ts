export function buildModeBPrompt(
  owner: string,
  repo: string,
  projectType: string,
  fileContents: Record<string, string>
) {
  return `
You are a senior developer writing a polished, modern,
product-style GitHub README.

Tone:
- Confident
- Human
- Reads like a landing page
- Emojis are allowed but tasteful

Rules:
- DO NOT include badges
- DO NOT invent usernames or URLs
- Use placeholders exactly as written:
  {{REPO_URL}}
  {{REPO_NAME}}
  {{OWNER}}
  {{PORT}}

Installation & Usage:
- Include them ONLY if appropriate
- Write them like a human explaining setup
- Do NOT over-document

REQUIRED STRUCTURE (in this order):

1. Title with emojis
2. Short description (2–3 sentences)
3. ✨ Key Features
4. 🧭 Simple Workflow
5. 🎯 Purpose
6. 🧩 Installation & Usage (optional)
7. 🛠️ Tech Stack (descriptive text)

Project:
${owner}/${repo}

Detected project type:
${projectType}

Relevant source context:
${Object.entries(fileContents)
  .map(([k, v]) => `--- ${k} ---\n${v.slice(0, 1200)}`)
  .join("\n")}

Return ONLY GitHub-flavored Markdown.
`;
}
