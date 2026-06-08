import { ReadmeClient } from "./readme-client";

export const metadata = {
  robots: { index: false, follow: true },
};

export default function LinkReadPage({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>;
}) {
  return <ReadmeClientWrapper params={params} />;
}

async function ReadmeClientWrapper({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>;
}) {
  const { owner, repo } = await params;
  return <ReadmeClient owner={owner} repo={repo} />;
}
