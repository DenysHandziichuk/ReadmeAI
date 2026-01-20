const BADGES: Record<string, string> = {
  JavaScript:
    "https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black",
  TypeScript:
    "https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white",
  React:
    "https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black",
  Vite:
    "https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white",
  Node:
    "https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white",
  Python:
    "https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white",
};

export function generateBadges(
  languages: string[],
  frameworks: string[]
): string {
  const tech = [...languages, ...frameworks];

  return tech
    .map(t => BADGES[t])
    .filter(Boolean)
    .map(url => `![${url.split("badge/")[1]?.split("-")[0]}](${url})`)
    .join(" ");
}
