type Analysis = {
  languages: string[];
  frameworks: string[];
  packageManager: string | null;
};

export function buildGroqPrompt(
  owner: string,
  repo: string,
  analysis: Analysis,
  files: Record<string, string>
) {
  return `
You are generating documentation content for a GitHub README.

Repository: ${owner}/${repo}

Tech stack (FACTS — do not invent):
- Languages: ${analysis.languages.join(", ") || "None"}
- Frameworks: ${analysis.frameworks.join(", ") || "None"}

Relevant file snippets:
${Object.entries(files)
  .map(
    ([name, content]) =>
      `--- ${name} ---\n${content.slice(0, 800)}`
  )
  .join("\n\n")}

TASK:
Return ONLY the following sections in GitHub-flavored Markdown.

FORMAT (MUST FOLLOW EXACTLY):

## 📄 Description
Write 2–3 sentences explaining what this project does.
Base this ONLY on the provided files.

## ✨ Features
Write 3–5 bullet points describing observable functionality.
If behavior is unclear, keep it generic and honest.

RULES:
- Do NOT invent dependencies or features.
- Do NOT mention installation or usage.
- Do NOT mention file names explicitly.
- Use ONLY the two headings above.
`;
}
