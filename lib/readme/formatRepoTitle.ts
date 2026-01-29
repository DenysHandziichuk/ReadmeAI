export function formatRepoTitle(repo: string) {
  return repo
    .split("-")
    .map((word) => {
      if (["ai", "js", "ts", "api", "ui"].includes(word.toLowerCase())) {
        return word.toUpperCase();
      }

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}
