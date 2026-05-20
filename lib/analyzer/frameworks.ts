export function detectFrameworks(files: string[], fileContents: Record<string, string> = {}): string[] {
  const frameworks = new Set<string>();

  const hasNextJs = files.some(
    (f) =>
      f === "next-env.d.ts" ||
      f.startsWith("app/") ||
      f.startsWith("pages/") ||
      f.startsWith("next.config."),
  );

  if (hasNextJs) frameworks.add("NextJS");

  const hasReactSource = files.some(
    (f) =>
      (f.endsWith(".jsx") || f.endsWith(".tsx")) &&
      (f.includes("/src/") || f.startsWith("src/")),
  );

  if (hasReactSource && !hasNextJs) {
    frameworks.add("React");
  }

  if (files.some((f) => f.endsWith(".vue"))) frameworks.add("Vue");
  if (files.some((f) => f === "angular.json")) frameworks.add("Angular");
  if (files.some((f) => f.includes("vite.config"))) frameworks.add("Vite");
  if (files.some((f) => f.includes("webpack.config"))) frameworks.add("Webpack");

  if (
    files.some(
      (f) =>
        f === "server.js" ||
        f === "app.js" ||
        f.startsWith("routes/") ||
        f.startsWith("src/routes/"),
    )
  ) {
    const pkgContent = fileContents["package.json"] || "";
    if (
      pkgContent.includes('"express"') ||
      (!pkgContent.includes('"fastify"') && !pkgContent.includes('"@nestjs/core"'))
    ) {
      frameworks.add("Express");
    }
  }

  if (files.includes("artisan")) frameworks.add("Laravel");
  if (files.some((f) => f === "nest-cli.json")) frameworks.add("NestJS");

  const hasTailwind = files.some(
    (f) =>
      f.startsWith("tailwind.config.") ||
      f === "postcss.config.js" ||
      f === "postcss.config.cjs" ||
      f === "postcss.config.mjs" ||
      f.includes("globals.css"),
  );

  if (hasTailwind) frameworks.add("TailwindCSS");
  if (files.some((f) => f.includes("bootstrap"))) frameworks.add("Bootstrap");

  if (files.includes("astro.config.mjs") || files.includes("astro.config.js") || files.includes("astro.config.ts")) {
    frameworks.add("Astro");
  }

  if (files.some((f) => f.endsWith(".svelte") || f.includes("svelte.config"))) {
    frameworks.add("Svelte");
  }

  if (files.includes("app.json") && files.some((f) => f.includes("expo"))) {
    frameworks.add("Expo");
  }

  if (files.includes("platformio.ini")) frameworks.add("PlatformIO");

  if (files.some((f) => f.endsWith(".py"))) {
    if (
      files.some((f) => f.includes("django")) ||
      files.some((f) => f.includes("wsgi")) ||
      files.includes("manage.py")
    ) {
      frameworks.add("Django");
    }

    if (
      files.some((f) => f.includes("flask")) ||
      files.some((f) => f === "app.py" && !files.includes("manage.py"))
    ) {
      frameworks.add("Flask");
    }

    if (files.some((f) => f.includes("fastapi") || f.includes("main.py"))) {
      const mainContent = fileContents["main.py"] || "";
      if (mainContent.includes("FastAPI")) frameworks.add("FastAPI");
    }
  }

  if (files.some((f) => f.endsWith(".rb"))) {
    if (files.includes("Gemfile") && files.some((f) => f.includes("config/routes.rb"))) {
      frameworks.add("Rails");
    }
    if (files.some((f) => f.includes("sinatra"))) frameworks.add("Sinatra");
  }

  if (files.some((f) => f.endsWith(".go"))) {
    if (files.some((f) => f.includes("gin") || f.includes("gin-gonic"))) frameworks.add("Gin");
    if (files.some((f) => f.includes("echo") || f.includes("labstack/echo"))) frameworks.add("Echo");
    if (files.some((f) => f.includes("fiber"))) frameworks.add("Fiber");
    if (files.some((f) => f.includes("chi"))) frameworks.add("Chi");
  }

  if (files.some((f) => f.endsWith(".rs") || files.includes("Cargo.toml"))) {
    const cargoContent = fileContents["Cargo.toml"] || "";
    if (cargoContent.includes("actix-web")) frameworks.add("Actix Web");
    if (cargoContent.includes("axum")) frameworks.add("Axum");
    if (cargoContent.includes("rocket")) frameworks.add("Rocket");
    if (cargoContent.includes("warp")) frameworks.add("Warp");
    if (cargoContent.includes("yew")) frameworks.add("Yew");
    if (cargoContent.includes("leptos")) frameworks.add("Leptos");
    if (cargoContent.includes("dioxus")) frameworks.add("Dioxus");
    if (cargoContent.includes("tauri")) frameworks.add("Tauri");
  }

  if (files.some((f) => f.endsWith(".kt") || f.endsWith(".kts"))) {
    if (files.some((f) => f.includes("spring") || f.includes("Spring"))) frameworks.add("Spring");
    if (files.some((f) => f.includes("ktor"))) frameworks.add("Ktor");
  }

  if (files.includes("Dockerfile") || files.includes("docker-compose.yml") || files.includes("docker-compose.yaml")) {
    frameworks.add("Docker");
  }

  if (files.some((f) => f.startsWith(".github/workflows/"))) frameworks.add("GitHub Actions");

  if (files.includes("nginx.conf")) frameworks.add("Nginx");
  if (files.includes("Caddyfile")) frameworks.add("Caddy");
  if (files.some((f) => f === "traefik.yml" || f === "traefik.yaml" || f === "traefik.toml")) frameworks.add("Traefik");

  return Array.from(frameworks);
}
