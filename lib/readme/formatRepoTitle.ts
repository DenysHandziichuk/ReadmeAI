export function formatRepoTitle(repo: string) {
  return repo
    .split("-")
    .map(word => {
      // Keep common acronyms uppercase
      if (["ai", "js", "ts", "api", "ui"].includes(word.toLowerCase())) {
        return word.toUpperCase();
      }

      // Capitalize normal words
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}
