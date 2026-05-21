import { useState, useCallback, useEffect } from "react";

export type UserSettings = {
  allowedOrgs: string[];
  shareRepos: boolean;
};

const SETTINGS_KEY = "readme-ai-settings";

const defaultSettings: UserSettings = {
  allowedOrgs: [],
  shareRepos: false,
};

export function getSettings(): UserSettings {
  const raw = localStorage.getItem(SETTINGS_KEY);
  if (!raw) return defaultSettings;
  try {
    const parsed = JSON.parse(raw);
    return {
      allowedOrgs: Array.isArray(parsed.allowedOrgs) ? parsed.allowedOrgs : [],
      shareRepos: typeof parsed.shareRepos === "boolean" ? parsed.shareRepos : false,
    };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: UserSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const updateSettings = useCallback((updates: Partial<UserSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates };
      saveSettings(next);
      return next;
    });
  }, []);

  const toggleOrg = useCallback((orgLogin: string) => {
    setSettings((prev) => {
      const allowedOrgs = prev.allowedOrgs.includes(orgLogin)
        ? prev.allowedOrgs.filter((o) => o !== orgLogin)
        : [...prev.allowedOrgs, orgLogin];
      const next = { ...prev, allowedOrgs };
      saveSettings(next);
      return next;
    });
  }, []);

  const toggleShareRepos = useCallback(() => {
    setSettings((prev) => {
      const next = { ...prev, shareRepos: !prev.shareRepos };
      saveSettings(next);
      return next;
    });
  }, []);

  return { settings, updateSettings, toggleOrg, toggleShareRepos };
}
