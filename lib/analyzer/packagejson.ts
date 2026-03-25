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
    
    
    if (deps.redux || deps["@reduxjs/toolkit"]) tech.push("Redux");
    if (deps.zustand) tech.push("Zustand");
    if (deps.jotai) tech.push("Jotai");
    if (deps.pinia) tech.push("Pinia");
    if (deps.vuex) tech.push("Vuex");

    
    if (deps["next-auth"] || deps["@auth/core"]) tech.push("NextAuth.js");
    if (deps["@clerk/nextjs"]) tech.push("Clerk");
    if (deps["@auth0/auth0-react"]) tech.push("Auth0");

    
    if (deps.axios) tech.push("Axios");
    if (deps.zod) tech.push("Zod");
    if (deps.trpc || deps["@trpc/client"]) tech.push("tRPC");
    if (deps["@tanstack/react-query"]) tech.push("React Query");

    return tech;
  } catch {
    return [];
  }
}
