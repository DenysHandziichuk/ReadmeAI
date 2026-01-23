export function buildModeBPrompt(
  owner: string,
  repo: string,
  projectType: string,
  fileContents: Record<string, string>
) {
  return `
You are a senior developer writing a polished, modern,
product-style GitHub README.

===========================
FORMATTING RULES (STRICT)
===========================

- Output ONLY valid GitHub-flavored Markdown
- Use headings exactly like:

# Title  
## Section  
### Subsection  

- Insert a horizontal rule ("---") between ALL major sections
- Do NOT place "---" immediately after the title
- Add ONE empty line before and after each "---"
- Separate paragraphs with a blank line
- Keep the intro description short (2–3 sentences max)
- Use bullet lists for Key Features
- Use numbered lists for Workflow steps
- Keep layout clean, modern, and spacious

===========================
EMOJI RULES (STRICT)
===========================

- The main title MUST start with 1–2 relevant emojis
- Every major section heading (##) MUST start with exactly ONE emoji
- Key Features bullet points MUST start with an emoji
- Emojis must match the meaning of the section
- Do NOT repeat the same emoji inside the same section

===========================
STYLE + TONE
===========================

- Confident, human, landing-page style
- Not generic, not robotic
- No filler sentences

===========================
HARD RULES
===========================

- DO NOT include badges (badges are injected separately)
- DO NOT invent usernames, links, or fake data
- Always use placeholders exactly as written:

{{REPO_URL}}
{{REPO_NAME}}
{{OWNER}}
{{PORT}}

===========================
INSTALLATION & USAGE RULES
===========================

- ALWAYS include a section:

## 🧩 Installation & Usage

- Write realistic setup commands depending on repo type:

Frontend (React/Vite/Next):
\`\`\`bash
npm install
npm run dev
\`\`\`

Node backend:
\`\`\`bash
npm install
npm start
\`\`\`

Python:
\`\`\`bash
pip install -r requirements.txt
python main.py
\`\`\`

If no installation is needed, clearly say:

"No installation is required."

- Always start with:

\`\`\`bash
git clone {{REPO_URL}}
cd {{REPO_NAME}}
\`\`\`

- Include localhost URL if relevant:

http://localhost:{{PORT}}

===========================
REQUIRED STRUCTURE (EXACT)
===========================

1. Title with emojis
2. Short description (2–3 sentences)
3. ✨ Key Features (bullets)
4. 🧭 Simple Workflow (numbered)
5. 🎯 Purpose
6. 🧩 Installation & Usage
7. 🛠️ Tech Stack (short descriptive paragraph, NOT bullet list)

Project: ${owner}/${repo}
Detected project type: ${projectType}

===========================
RELEVANT SOURCE CONTEXT
===========================

${Object.entries(fileContents)
  .map(([path, content]) => {
    return `--- FILE: ${path} ---\n${content.slice(0, 1200)}\n`;
  })
  .join("\n")}

Return ONLY GitHub-flavored Markdown.
`;
}
