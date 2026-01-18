import RepoClient from "./repo-client";
type Props = {
  params: Promise<{
    owner: string;
    repo: string;
  }>;
};

export default async function RepoPage({ params }: Props) {
  const { owner, repo } = await params;

  return <RepoClient owner={owner} repo={repo} />;
}