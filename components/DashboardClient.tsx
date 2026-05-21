"use client";

import { useEffect, useState } from "react";
import RepoSearch from "@/components/RepoSearch";
import HistoryList from "@/components/HistoryList";
import { useUserSettings } from "@/lib/store/userSettingsStore";
import { Building2, Settings, AlertTriangle } from "lucide-react";
import Link from "next/link";

type Repo = {
  name: string;
  owner: string;
  private: boolean;
  description: string | null;
};

export default function DashboardClient({ personalRepos }: { personalRepos: Repo[] }) {
  const { settings } = useUserSettings();
  const [orgRepos, setOrgRepos] = useState<Repo[]>([]);
  const [loadingOrgs, setLoadingOrgs] = useState(false);
  const [orgErrors, setOrgErrors] = useState<string[]>([]);

  useEffect(() => {
    async function fetchOrgRepos() {
      if (!settings.shareRepos || settings.allowedOrgs.length === 0) {
        setOrgRepos([]);
        setOrgErrors([]);
        return;
      }

      setLoadingOrgs(true);
      setOrgErrors([]);
      try {
        const results = await Promise.allSettled(
          settings.allowedOrgs.map(async (org) => {
            const res = await fetch(`/api/github/org-repos?org=${encodeURIComponent(org)}`);
            if (!res.ok) {
              throw new Error(org);
            }
            const data = await res.json();
            return data.repos || [];
          }),
        );

        const repos: Repo[] = [];
        const errors: string[] = [];
        for (const result of results) {
          if (result.status === "fulfilled") {
            repos.push(...result.value);
          } else {
            const orgName = result.reason?.message || "unknown";
            errors.push(orgName);
          }
        }
        setOrgRepos(repos);
        setOrgErrors(errors);
      } catch {
        setOrgRepos([]);
      } finally {
        setLoadingOrgs(false);
      }
    }

    fetchOrgRepos();
  }, [settings.shareRepos, settings.allowedOrgs]);

  const allRepos = [...personalRepos, ...orgRepos];

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <div className="space-y-3">
        <h1 className="text-5xl font-bold tracking-tight">
          Choose a Repository
        </h1>
        <p className="max-w-xl text-lg text-zinc-400">
          Select a repo and instantly generate a{" "}
          <span className="font-medium text-white">
            product-style README
          </span>
          .
        </p>
      </div>

      {settings.shareRepos && settings.allowedOrgs.length > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3">
          <Building2 size={16} className="text-green-400 shrink-0" />
          <p className="text-xs text-green-300">
            Showing repositories from <span className="font-bold">{settings.allowedOrgs.join(", ")}</span>
          </p>
          <Link
            href="/settings"
            className="ml-auto flex items-center gap-1 text-xs text-green-400 hover:text-green-300 transition"
          >
            <Settings size={12} />
            Edit
          </Link>
        </div>
      )}

      {orgErrors.length > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-3">
          <AlertTriangle size={16} className="text-yellow-400 shrink-0" />
          <p className="text-xs text-yellow-300">
            Could not load repos from <span className="font-bold">{orgErrors.join(", ")}</span>. Check your access in{" "}
            <Link href="/settings" className="underline hover:text-yellow-200 transition">Settings</Link>.
          </p>
        </div>
      )}

      {loadingOrgs ? (
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
          Loading organization repositories...
        </div>
      ) : (
        <RepoSearch repos={allRepos} />
      )}

      {!settings.shareRepos && (
        <div className="rounded-xl border border-dashed border-zinc-800 p-6 text-center">
          <Building2 size={24} className="mx-auto mb-2 text-zinc-700" />
          <p className="text-sm text-zinc-500">
            Want to include organization repositories?
          </p>
          <Link
            href="/settings"
            className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-green-400 hover:text-green-300 transition"
          >
            <Settings size={12} />
            Enable in Settings
          </Link>
        </div>
      )}

      <div className="pt-10 border-t border-zinc-900">
        <HistoryList />
      </div>
    </div>
  );
}
