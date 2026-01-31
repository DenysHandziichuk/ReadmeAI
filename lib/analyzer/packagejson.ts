export function detectFromPackageJson(pkgRaw: string) {
  const tech: string[] = [];

  try {
    const pkg = JSON.parse(pkgRaw);

    const deps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
    };

    if (deps.next) tech.push("NextJS");
    if (deps.react) tech.push("React");
    if (deps.express) tech.push("Express");

    if (deps.tailwindcss) tech.push("TailwindCSS");

    if (deps.eslint) tech.push("ESLint");
    if (deps.prettier) tech.push("Prettier");
    if (deps.jest) tech.push("Jest");
    if (deps.vitest) tech.push("Vitest");
    if (deps.fastify) tech.push("Fastify");
    if (deps["@nestjs/core"]) tech.push("NestJS");
    if (deps.prisma) tech.push("Prisma");
    if (deps.graphql) tech.push("GraphQL");
    if (deps.vite) tech.push("Vite");
    if (deps.svelte) tech.push("Svelte");
    if (deps.nuxt) tech.push("Nuxt");
    if (deps.playwright) tech.push("Playwright");
    if (deps.express) tech.push("Express");
    if (deps.fastify) tech.push("Fastify");
    if (deps["@nestjs/core"]) tech.push("NestJS");
    if (deps.prisma) tech.push("Prisma");
    if (deps.graphql) tech.push("GraphQL");
    if (deps.firebase || deps["firebase-admin"])
      tech.push("Firebase");
    if (deps["@supabase/supabase-js"])
      tech.push("Supabase");
    

    return tech;
  } catch {
    return [];
  }
}
