import { useEffect, useState } from "react";

export type BadgeStyle = "for-the-badge" | "flat" | "flat-square" | "plastic" | "social";
export type Theme = "startup" | "minimal" | "enterprise";

export type StoredReadme = {
  owner: string;
  repo: string;
  content: string;
  tech?: string[];
  style?: BadgeStyle;
  theme?: Theme;
  timestamp?: number;
};

const KEY = "mode-b-readme";
const HISTORY_KEY = "readme-ai-history";

export function setReadme(data: StoredReadme) {
  if (typeof window === "undefined") return;
  const dataWithTime = { ...data, timestamp: Date.now() };
  sessionStorage.setItem(KEY, JSON.stringify(dataWithTime));
  
  
  addToHistory(dataWithTime);
}

function addToHistory(data: StoredReadme) {
  if (typeof window === "undefined") return;
  const historyRaw = localStorage.getItem(HISTORY_KEY);
  let history: StoredReadme[] = historyRaw ? JSON.parse(historyRaw) : [];
  
  
  history = history.filter(h => !(h.owner === data.owner && h.repo === data.repo));
  
  
  history.unshift(data);
  
  
  history = history.slice(0, 10);
  
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function getHistory(): StoredReadme[] {
  if (typeof window === "undefined") return [];
  const historyRaw = localStorage.getItem(HISTORY_KEY);
  return historyRaw ? JSON.parse(historyRaw) : [];
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

export function useStoredReadme() {
  const [stored, setStored] = useState<StoredReadme | null | undefined>(
    undefined,
  );

  useEffect(() => {
    const data = getReadme();
    setStored(data);
  }, []);

  return stored;
}

export function useReadmeHistory() {
  const [history, setHistory] = useState<StoredReadme[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  return history;
}
