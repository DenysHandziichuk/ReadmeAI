"use client";

import { useEffect, useState } from "react";
import RepoCard from "./RepoCard";

type Repo = {
  name: string;
  owner: string;
};

export default function RepoList() {
  const [repos, setRepos] = useState<Repo[]>([]);

  useEffect(() => {
    fetch("/api/repos")
      .then((r) => r.json())
      .then(setRepos);
  }, []);

  return (
    <div className="grid gap-2">
      {repos.map((r) => (
        <RepoCard key={`${r.owner}/${r.name}`} repo={r} />
      ))}
    </div>
  );
}
