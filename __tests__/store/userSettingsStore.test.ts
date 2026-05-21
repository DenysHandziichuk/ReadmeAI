import { describe, it, expect, beforeEach } from "vitest";
import { getSettings, saveSettings, useUserSettings } from "@/lib/store/userSettingsStore";

describe("userSettingsStore", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("getSettings", () => {
    it("returns default settings when nothing is stored", () => {
      const settings = getSettings();
      expect(settings).toEqual({ allowedOrgs: [], shareRepos: false });
    });

    it("returns stored settings", () => {
      localStorage.setItem("readme-ai-settings", JSON.stringify({ allowedOrgs: ["my-org"], shareRepos: true }));
      const settings = getSettings();
      expect(settings).toEqual({ allowedOrgs: ["my-org"], shareRepos: true });
    });

    it("returns defaults for malformed JSON", () => {
      localStorage.setItem("readme-ai-settings", "not-json");
      const settings = getSettings();
      expect(settings).toEqual({ allowedOrgs: [], shareRepos: false });
    });

    it("returns defaults for partial data", () => {
      localStorage.setItem("readme-ai-settings", JSON.stringify({ allowedOrgs: ["org1"] }));
      const settings = getSettings();
      expect(settings).toEqual({ allowedOrgs: ["org1"], shareRepos: false });
    });

    it("handles non-array allowedOrgs gracefully", () => {
      localStorage.setItem("readme-ai-settings", JSON.stringify({ allowedOrgs: "not-array", shareRepos: true }));
      const settings = getSettings();
      expect(settings.allowedOrgs).toEqual([]);
      expect(settings.shareRepos).toBe(true);
    });
  });

  describe("saveSettings", () => {
    it("saves settings to localStorage", () => {
      saveSettings({ allowedOrgs: ["org-a", "org-b"], shareRepos: true });
      const raw = localStorage.getItem("readme-ai-settings");
      expect(raw).not.toBeNull();
      const parsed = JSON.parse(raw!);
      expect(parsed).toEqual({ allowedOrgs: ["org-a", "org-b"], shareRepos: true });
    });

    it("overwrites previous settings", () => {
      saveSettings({ allowedOrgs: ["org-a"], shareRepos: false });
      saveSettings({ allowedOrgs: ["org-b"], shareRepos: true });
      const raw = localStorage.getItem("readme-ai-settings");
      const parsed = JSON.parse(raw!);
      expect(parsed.allowedOrgs).toEqual(["org-b"]);
      expect(parsed.shareRepos).toBe(true);
    });
  });
});
