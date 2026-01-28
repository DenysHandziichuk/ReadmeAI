export function detectFrameworks(files: string[]): string[] {
  const frameworks = new Set<string>();

  /* ---------------------------
   Frontend Frameworks
  ---------------------------- */

  // ✅ NextJS (must return "NextJS")
  const hasNextJs = files.some(
    (f) =>
      f === "next-env.d.ts" ||
      f.startsWith("app/") ||
      f.startsWith("pages/") ||
      f.startsWith("next.config.")
  );

  if (hasNextJs) frameworks.add("NextJS");

  // ✅ React (only if NOT NextJS)
  const hasReactSource = files.some(
    (f) =>
      (f.endsWith(".jsx") || f.endsWith(".tsx")) &&
      (f.includes("/src/") || f.startsWith("src/"))
  );

  if (hasReactSource && !hasNextJs) {
    frameworks.add("React");
  }

  // ✅ Vue
  const hasVue = files.some((f) => f.endsWith(".vue"));
  if (hasVue) frameworks.add("Vue");

  // ✅ Angular
  const hasAngular = files.some((f) => f === "angular.json");
  if (hasAngular) frameworks.add("Angular");

  /* ---------------------------
   Build Tools
  ---------------------------- */

  // ✅ Vite
  const hasViteConfig = files.some((f) => f.includes("vite.config"));
  if (hasViteConfig) frameworks.add("Vite");

  // ✅ Webpack
  const hasWebpack = files.some((f) => f.includes("webpack.config"));
  if (hasWebpack) frameworks.add("Webpack");

  /* ---------------------------
   Backend Frameworks
  ---------------------------- */

  // ✅ Express (must return "Express")
  const hasExpress = files.some(
    (f) =>
      f === "server.js" ||
      f === "app.js" ||
      f.startsWith("routes/")
  );

  if (hasExpress) frameworks.add("Express");

  // ✅ NestJS
  const hasNest = files.some((f) => f === "nest-cli.json");
  if (hasNest) frameworks.add("NestJS");

  /* ---------------------------
   Styling
  ---------------------------- */

  // ✅ TailwindCSS
  const hasTailwind = files.some(
  (f) =>
    f.startsWith("tailwind.config.") ||
    f === "postcss.config.js" ||
    f === "postcss.config.cjs" ||
    f === "postcss.config.mjs" ||
    f.includes("globals.css")
);

  if (hasTailwind) frameworks.add("TailwindCSS");

  // ✅ Bootstrap
  const hasBootstrap = files.some((f) =>
    f.includes("bootstrap")
  );
  if (hasBootstrap) frameworks.add("Bootstrap");

  /* ---------------------------
   Embedded
  ---------------------------- */

  // ✅ PlatformIO
  if (files.includes("platformio.ini")) {
    frameworks.add("PlatformIO");
  }

  return Array.from(frameworks);
}
