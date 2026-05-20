import * as TOML from "smol-toml";

export type PyProjectInfo = {
  name?: string;
  version?: string;
  description?: string;
  pythonRequires?: string;
  dependencies: string[];
  frameworks: string[];
  buildSystem?: string;
};

export type CargoInfo = {
  name?: string;
  version?: string;
  description?: string;
  edition?: string;
  dependencies: string[];
  frameworks: string[];
};

export function parsePyProjectToml(raw: string): PyProjectInfo {
  try {
    const data = TOML.parse(raw) as Record<string, unknown>;
    const project = (data["project"] as Record<string, unknown>) || {};
    const tool = (data["tool"] as Record<string, unknown>) || {};
    const buildSystemVal = (data["build-system"] as Record<string, unknown>)?.["build-backend"] as string | undefined;

    const rawDeps = project["dependencies"];
    const deps: string[] = Array.isArray(rawDeps) ? rawDeps as string[] : [];
    const frameworks: string[] = [];

    const depStr = deps.join(" ");

    if (depStr.includes("django")) frameworks.push("Django");
    if (depStr.includes("flask")) frameworks.push("Flask");
    if (depStr.includes("fastapi")) frameworks.push("FastAPI");
    if (depStr.includes("starlette")) frameworks.push("Starlette");
    if (depStr.includes("sqlalchemy")) frameworks.push("SQLAlchemy");
    if (depStr.includes("pydantic")) frameworks.push("Pydantic");
    if (depStr.includes("celery")) frameworks.push("Celery");
    if (depStr.includes("scrapy")) frameworks.push("Scrapy");
    if (depStr.includes("aiohttp")) frameworks.push("aiohttp");
    if (depStr.includes("sanic")) frameworks.push("Sanic");
    if (depStr.includes("tornado")) frameworks.push("Tornado");
    if (depStr.includes("pytest")) frameworks.push("pytest");
    if (depStr.includes("httpx")) frameworks.push("httpx");

    if (tool["poetry"]) frameworks.push("Poetry");
    if (buildSystemVal?.includes("setuptools")) frameworks.push("setuptools");
    if (buildSystemVal?.includes("flit")) frameworks.push("flit");
    if (buildSystemVal?.includes("hatch")) frameworks.push("hatch");

    return {
      name: project["name"] as string | undefined,
      version: project["version"] as string | undefined,
      description: project["description"] as string | undefined,
      pythonRequires: project["requires-python"] as string | undefined,
      dependencies: deps,
      frameworks,
      buildSystem: buildSystemVal,
    };
  } catch {
    return { dependencies: [], frameworks: [] };
  }
}

export function parseCargoToml(raw: string): CargoInfo {
  try {
    const data = TOML.parse(raw) as Record<string, unknown>;
    const pkg = (data["package"] as Record<string, unknown>) || {};
    const deps = (data["dependencies"] as Record<string, unknown>) || {};
    const depNames = Object.keys(deps);
    const frameworks: string[] = [];

    if (depNames.includes("actix-web")) frameworks.push("Actix Web");
    if (depNames.includes("axum")) frameworks.push("Axum");
    if (depNames.includes("rocket")) frameworks.push("Rocket");
    if (depNames.includes("warp")) frameworks.push("Warp");
    if (depNames.includes("tokio")) frameworks.push("Tokio");
    if (depNames.includes("serde")) frameworks.push("Serde");
    if (depNames.includes("clap")) frameworks.push("clap");
    if (depNames.includes("diesel")) frameworks.push("Diesel");
    if (depNames.includes("sqlx")) frameworks.push("SQLx");
    if (depNames.includes("sea-orm")) frameworks.push("SeaORM");
    if (depNames.includes("reqwest")) frameworks.push("reqwest");
    if (depNames.includes("yew")) frameworks.push("Yew");
    if (depNames.includes("leptos")) frameworks.push("Leptos");
    if (depNames.includes("dioxus")) frameworks.push("Dioxus");
    if (depNames.includes("tauri")) frameworks.push("Tauri");

    return {
      name: pkg["name"] as string | undefined,
      version: pkg["version"] as string | undefined,
      description: pkg["description"] as string | undefined,
      edition: pkg["edition"] as string | undefined,
      dependencies: depNames,
      frameworks,
    };
  } catch {
    return { dependencies: [], frameworks: [] };
  }
}
