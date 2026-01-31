export function detectFrameworks(files: string[]): string[] {
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

  const hasVue = files.some((f) => f.endsWith(".vue"));
  if (hasVue) frameworks.add("Vue");

  const hasAngular = files.some((f) => f === "angular.json");
  if (hasAngular) frameworks.add("Angular");

  const hasViteConfig = files.some((f) => f.includes("vite.config"));
  if (hasViteConfig) frameworks.add("Vite");

  const hasWebpack = files.some((f) => f.includes("webpack.config"));
  if (hasWebpack) frameworks.add("Webpack");

  const hasExpress = files.some(
    (f) => f === "server.js" || f === "app.js" || f.startsWith("routes/"),
  );

  if (hasExpress) frameworks.add("Express");

  const hasLaravel =
  files.includes("artisan");
  if (hasLaravel) {
    return ["Laravel"]
  }

    if (files.includes("Dockerfile")) return ["Docker"]
    

  if (files.includes("docker-compose.yml")) return ["Docker"]

  if (files.includes("nginx.conf")) return ["Nginx"]
    
  

  const hasNest = files.some((f) => f === "nest-cli.json");
  if (hasNest) frameworks.add("NestJS");

  const hasTailwind = files.some(
    (f) =>
      f.startsWith("tailwind.config.") ||
      f === "postcss.config.js" ||
      f === "postcss.config.cjs" ||
      f === "postcss.config.mjs" ||
      f.includes("globals.css"),
  );

  if (hasTailwind) frameworks.add("TailwindCSS");

  const hasBootstrap = files.some((f) => f.includes("bootstrap"));
  if (hasBootstrap) frameworks.add("Bootstrap");

  if (files.includes("platformio.ini")) {
    frameworks.add("PlatformIO");
  }

  return Array.from(frameworks);
}
