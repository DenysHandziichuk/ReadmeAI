import yaml from "js-yaml";

export type DockerComposeInfo = {
  services: string[];
  hasDatabase: boolean;
  databases: string[];
  hasReverseProxy: boolean;
};

export type GitHubActionsInfo = {
  workflows: string[];
  triggers: string[];
  hasCI: boolean;
  hasCD: boolean;
};

export function parseDockerCompose(raw: string): DockerComposeInfo {
  try {
    const data = yaml.load(raw) as Record<string, unknown> | undefined;
    if (!data) return { services: [], hasDatabase: false, databases: [], hasReverseProxy: false };

    const servicesObj = data["services"] as Record<string, unknown> | undefined;
    const services = servicesObj ? Object.keys(servicesObj) : [];
    const databases: string[] = [];
    let hasDatabase = false;
    let hasReverseProxy = false;

    const dbImages = ["postgres", "mysql", "mongo", "redis", "mariadb", "cassandra", "couchdb", "influxdb", "clickhouse"];
    const dbNames = ["postgres", "postgresql", "mysql", "mongodb", "mongo", "redis", "mariadb", "cassandra", "couchdb", "influxdb", "clickhouse", "db", "database", "sql"];

    if (servicesObj) {
      for (const [name, config] of Object.entries(servicesObj)) {
        const svc = config as Record<string, unknown>;
        const image = String(svc["image"] || "").toLowerCase();
        const svcName = name.toLowerCase();

        if (dbImages.some((db) => image.includes(db)) || dbNames.some((db) => svcName.includes(db))) {
          hasDatabase = true;
          if (image.includes("postgres") || svcName.includes("postgres")) databases.push("PostgreSQL");
          else if (image.includes("mysql") || svcName.includes("mysql")) databases.push("MySQL");
          else if (image.includes("mongo") || svcName.includes("mongo")) databases.push("MongoDB");
          else if (image.includes("redis") || svcName.includes("redis")) databases.push("Redis");
          else if (image.includes("mariadb") || svcName.includes("mariadb")) databases.push("MariaDB");
          else databases.push(svcName);
        }

        if (image.includes("nginx") || image.includes("traefik") || image.includes("caddy") || image.includes("haproxy")) {
          hasReverseProxy = true;
        }
      }
    }

    return { services, hasDatabase, databases, hasReverseProxy };
  } catch {
    return { services: [], hasDatabase: false, databases: [], hasReverseProxy: false };
  }
}

export function parseGitHubActions(raw: string): GitHubActionsInfo {
  try {
    const data = yaml.load(raw) as Record<string, unknown> | undefined;
    if (!data) return { workflows: [], triggers: [], hasCI: false, hasCD: false };

    const triggers: string[] = [];

    const onVal = data["on"];
    if (onVal) {
      if (typeof onVal === "string") {
        triggers.push(onVal);
      } else if (typeof onVal === "object" && onVal !== null) {
        triggers.push(...Object.keys(onVal as Record<string, unknown>));
      }
    }

    const hasCI = triggers.some((t) => ["push", "pull_request"].includes(t));
    const hasCD = triggers.some((t) => ["release", "deployment", "workflow_dispatch"].includes(t));

    return {
      workflows: data["name"] ? [String(data["name"])] : [],
      triggers,
      hasCI,
      hasCD,
    };
  } catch {
    return { workflows: [], triggers: [], hasCI: false, hasCD: false };
  }
}
