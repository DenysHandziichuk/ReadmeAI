export type DockerfileInfo = {
  baseImage: string | null;
  exposedPorts: string[];
  hasMultiStage: boolean;
  stages: number;
  workdir: string | null;
  entrypoint: string | null;
  copyFromStages: string[];
};

export function parseDockerfile(raw: string): DockerfileInfo {
  const lines = raw.split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#"));

  let baseImage: string | null = null;
  const exposedPorts: string[] = [];
  let hasMultiStage = false;
  const fromStages: string[] = [];
  let workdir: string | null = null;
  let entrypoint: string | null = null;

  for (const line of lines) {
    const upper = line.toUpperCase();

    if (upper.startsWith("FROM")) {
      const match = line.match(/^FROM\s+(\S+)/i);
      if (match) {
        if (baseImage === null) {
          baseImage = match[1];
        }
        fromStages.push(match[1]);
      }
      if (upper.includes(" AS ")) {
        hasMultiStage = true;
      }
    }

    if (upper.startsWith("EXPOSE")) {
      const port = line.replace(/^EXPOSE\s+/i, "").trim();
      if (port) exposedPorts.push(port);
    }

    if (upper.startsWith("WORKDIR")) {
      workdir = line.replace(/^WORKDIR\s+/i, "").trim();
    }

    if (upper.startsWith("ENTRYPOINT")) {
      entrypoint = line.replace(/^ENTRYPOINT\s+/i, "").trim();
    }

    if (upper.startsWith("COPY") && upper.includes("--FROM=")) {
      const match = line.match(/--from=(\S+)/i);
      if (match) fromStages.push(match[1]);
    }
  }

  return {
    baseImage,
    exposedPorts,
    hasMultiStage,
    stages: fromStages.length,
    workdir,
    entrypoint,
    copyFromStages: fromStages,
  };
}
