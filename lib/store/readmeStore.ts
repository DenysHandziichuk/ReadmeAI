export type StoredReadme = {
  owner: string;
  repo: string;
  content: string;
};

const KEY = "mode-b-readme";

export function setReadme(data: StoredReadme) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(data));
}

export function getReadme(): StoredReadme | null {
  if (typeof window === "undefined") return null;

  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredReadme;
  } catch {
    return null;
  }
}

export function clearReadme() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}
