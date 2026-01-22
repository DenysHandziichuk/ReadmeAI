export function buildModeBPrompt(
  owner: string,
  repo: string,
  projectType: string,
  fileContents: Record<string, string>
) {
  return `
You are a senior developer writing a polished, modern,
product-style GitHub README.

Formatting rules (STRICT):
- Use Markdown headings exactly as shown (# for title, ## for sections, ### for subsections)
- Insert a horizontal rule ('---') between all major sections
- Do NOT place '---' immediately after the title
- Add one empty line before and after each '---'
- Separate paragraphs with a blank line
- Keep descriptions concise (2–3 sentences max)
- Use bullet lists for features and tech stack
- Use numbered lists for workflows
- Use bold text sparingly for emphasis
- Keep the layout clean, readable, and spacious

Emoji rules (STRICT):
- The main title MUST start with 1–2 relevant emojis
- Every major section heading (##) MUST start with exactly one emoji
- Key Features bullet points MUST start with an emoji
- Emojis must be relevant to the section or feature
- Do NOT repeat the same emoji within the same section



Tone:
- Confident, human, landing-page style
- Emojis allowed but tasteful
- Clear, concise, not generic

Rules:
- DO NOT include badges (they are added separately)
- DO NOT invent usernames or URLs
- Use placeholders exactly as written:
  {{REPO_URL}}
  {{REPO_NAME}}
  {{OWNER}}
  {{PORT}}

Installation & Usage:
- Include ONLY if appropriate for the project
- Write like a human explaining setup
- Prefer clarity over verbosity
- Use placeholders where URLs/ports appear

REQUIRED STRUCTURE (exact order):
1. Title with emojis
2. Short description (2–3 sentences)
3. ✨ Key Features (bullet list)
4. 🧭 Simple Workflow (numbered steps)
5. 🎯 Purpose
6. 🧩 Installation & Usage (optional)
7. 🛠️ Tech Stack (descriptive text, no bullet list)

Project: ${owner}/${repo}
Detected project type: ${projectType}

Relevant source context:
${Object.entries(fileContents)
  .map(([k, v]) => `--- ${k} ---\n${v.slice(0, 1200)}`)
  .join("\n")}

Return ONLY GitHub-flavored Markdown.
`;
}
