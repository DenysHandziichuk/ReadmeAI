"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Building2, ToggleLeft, ToggleRight, Shield, Check, RefreshCw } from "lucide-react";
import { useUserSettings } from "@/lib/store/userSettingsStore";

type Org = {
  login: string;
  avatar_url: string;
  description: string | null;
};

type GitHubUser = {
  name: string;
  login: string;
  avatar_url: string;
};

export default function SettingsPage() {
  const { settings, toggleOrg, toggleShareRepos } = useUserSettings();
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingOrgs, setLoadingOrgs] = useState(false);
  const [orgsError, setOrgsError] = useState<string | null>(null);
  const [needsReauth, setNeedsReauth] = useState(false);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [saved, setSaved] = useState(false);

  async function loadOrgs() {
    setLoadingOrgs(true);
    setOrgsError(null);
    setNeedsReauth(false);
    try {
      const orgsRes = await fetch("/api/github/orgs");

      if (orgsRes.status === 401) {
        setOrgsError("Not authenticated. Please sign in to view organizations.");
        setOrgs([]);
      } else if (!orgsRes.ok) {
        const orgsData = await orgsRes.json().catch(() => ({}));
        if (orgsData.error === "missing_scope" || orgsData.needsReauth) {
          setNeedsReauth(true);
          setOrgs(orgsData.orgs || []);
        } else {
          setOrgsError("Failed to load organizations.");
          setOrgs([]);
        }
      } else {
        const orgsData = await orgsRes.json();
        const fetchedOrgs = orgsData.orgs || [];
        console.log("Fetched orgs:", fetchedOrgs.length, fetchedOrgs.map((o: Org) => o.login));
        setOrgs(fetchedOrgs);
        if (orgsData.needsReauth && fetchedOrgs.length === 0) {
          setNeedsReauth(true);
        }
      }
    } catch (err) {
      console.error("Orgs fetch error:", err);
      setOrgsError("Something went wrong loading organizations.");
      setOrgs([]);
    } finally {
      setLoadingOrgs(false);
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const userRes = await fetch("/api/github/user");

        if (!userRes.ok) {
          setOrgsError("Not authenticated. Please sign in.");
          setLoading(false);
          return;
        }

        const userData = await userRes.json();
        setUser(userData);
      } catch (err) {
        console.error("Settings fetch error:", err);
        setOrgsError("Something went wrong.");
      } finally {
        setLoading(false);
      }

      loadOrgs();
    }
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
  };

  const selectAllOrgs = () => {
    for (const org of orgs) {
      if (!settings.allowedOrgs.includes(org.login)) {
        toggleOrg(org.login);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="linear-bg min-h-screen bg-black px-6 py-14 pt-24 text-white">
      <div className="mx-auto max-w-3xl space-y-10">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 border border-green-500/20">
              <Settings size={20} className="text-green-400" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
          </div>
          <p className="max-w-lg text-lg text-zinc-400">
            Manage your organization access and repository sharing preferences.
          </p>
        </div>

        {user && (
          <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Shield size={18} className="text-zinc-400" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Account</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 overflow-hidden rounded-xl border-2 border-zinc-800 bg-zinc-900">
                <Image src={user.avatar_url} alt={user.login} width={48} height={48} className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="font-bold text-white">{user.name || user.login}</p>
                <p className="text-xs text-zinc-500 font-mono">@{user.login}</p>
              </div>
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 space-y-6">
          <div className="flex items-center gap-3">
            <ToggleLeft size={18} className="text-zinc-400" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Repository Sharing</h2>
          </div>

          <p className="text-sm text-zinc-400 leading-relaxed">
            When enabled, your organization repositories will be visible on the dashboard and available for README generation.
            Only organizations you explicitly allow will be included.
          </p>

          <button
            onClick={toggleShareRepos}
            className={`flex items-center gap-3 rounded-xl border px-5 py-4 text-left transition-all w-full ${
              settings.shareRepos
                ? "border-green-500/30 bg-green-500/5"
                : "border-zinc-800 bg-zinc-900 hover:bg-zinc-800"
            }`}
          >
            {settings.shareRepos ? (
              <ToggleRight size={24} className="text-green-400 shrink-0" />
            ) : (
              <ToggleLeft size={24} className="text-zinc-500 shrink-0" />
            )}
            <div>
              <p className={`text-sm font-bold ${settings.shareRepos ? "text-green-400" : "text-zinc-300"}`}>
                Share Organization Repositories
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                {settings.shareRepos
                  ? "Organization repos are visible on your dashboard"
                  : "Only your personal repos are shown"}
              </p>
            </div>
          </button>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 size={18} className="text-zinc-400" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">
                Organizations
              </h2>
              {orgs.length > 0 && (
                <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-zinc-400">
                  {orgs.length}
                </span>
              )}
            </div>
            <button
              onClick={loadOrgs}
              disabled={loadingOrgs}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-white disabled:opacity-50"
            >
              <RefreshCw size={12} className={loadingOrgs ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {loadingOrgs ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
            </div>
          ) : needsReauth ? (
            <div className="rounded-xl border border-dashed border-zinc-800 p-8 text-center">
              <Building2 size={32} className="mx-auto mb-3 text-zinc-700" />
              <p className="text-sm text-zinc-500">Organization access requires additional permissions.</p>
              <p className="text-xs text-zinc-600 mt-1">
                Re-authenticate to grant the <span className="font-mono text-zinc-400">read:org</span> scope.
              </p>
              <a
                href="/api/auth/github?reauth=true"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black transition hover:bg-zinc-200"
              >
                Re-authenticate with GitHub
              </a>
            </div>
          ) : orgsError ? (
            <div className="rounded-xl border border-dashed border-zinc-800 p-8 text-center">
              <Building2 size={32} className="mx-auto mb-3 text-zinc-700" />
              <p className="text-sm text-zinc-500">{orgsError}</p>
              <button
                onClick={loadOrgs}
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800"
              >
                <RefreshCw size={14} />
                Try Again
              </button>
            </div>
          ) : orgs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-800 p-8 text-center">
              <Building2 size={32} className="mx-auto mb-3 text-zinc-700" />
              <p className="text-sm text-zinc-500">No organizations found.</p>
              <p className="text-xs text-zinc-600 mt-1">
                Make sure your GitHub account is a member of at least one organization.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-zinc-500">
                  Select which organizations&apos; repositories to show on your dashboard.
                </p>
                <button
                  onClick={selectAllOrgs}
                  className="text-xs font-medium text-green-400 hover:text-green-300 transition"
                >
                  Select All
                </button>
              </div>
              <div className="space-y-2">
                {orgs.map((org) => {
                  const isSelected = settings.allowedOrgs.includes(org.login);
                  return (
                    <button
                      key={org.login}
                      onClick={() => toggleOrg(org.login)}
                      className={`flex w-full items-center gap-4 rounded-xl border px-4 py-3 text-left transition-all ${
                        isSelected
                          ? "border-green-500/30 bg-green-500/5"
                          : "border-zinc-800 bg-zinc-900 hover:bg-zinc-800"
                      }`}
                    >
                      <div className="h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
                        <Image
                          src={org.avatar_url}
                          alt={org.login}
                          width={32}
                          height={32}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold ${isSelected ? "text-green-400" : "text-zinc-300"}`}>
                          {org.login}
                        </p>
                        {org.description && (
                          <p className="text-xs text-zinc-500 truncate">{org.description}</p>
                        )}
                      </div>
                      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-all ${
                        isSelected
                          ? "border-green-500 bg-green-500"
                          : "border-zinc-700 bg-zinc-900"
                      }`}>
                        {isSelected && <Check size={14} className="text-black" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        <div className="flex items-center justify-end gap-3 pt-2">
          <motion.button
            onClick={handleSave}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all ${
              saved
                ? "bg-green-500/10 border border-green-500/30 text-green-400"
                : "bg-white text-black hover:bg-zinc-200"
            }`}
          >
            {saved ? (
              <>
                <Check size={16} />
                Saved
              </>
            ) : (
              "Save Settings"
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
