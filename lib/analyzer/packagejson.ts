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
    if (deps.tailwindcss) tech.push("TailwindCSS");
    if (deps.express) tech.push("Express");
    if (deps.fastify) tech.push("Fastify");
    if (deps["@nestjs/core"]) tech.push("NestJS");
    if (deps.prisma) tech.push("Prisma");
    if (deps.graphql) tech.push("GraphQL");
    if (deps.vite) tech.push("Vite");
    if (deps.svelte) tech.push("Svelte");
    if (deps.nuxt) tech.push("Nuxt");
    if (deps.vue) tech.push("Vue");
    if (deps["@angular/core"]) tech.push("Angular");
    if (deps.astro) tech.push("Astro");

    if (deps.eslint) tech.push("ESLint");
    if (deps.prettier) tech.push("Prettier");
    if (deps.jest) tech.push("Jest");
    if (deps.vitest) tech.push("Vitest");
    if (deps.playwright) tech.push("Playwright");
    if (deps.cypress) tech.push("Cypress");
    if (deps["@testing-library/react"]) tech.push("Testing Library");

    if (deps.firebase || deps["firebase-admin"]) tech.push("Firebase");
    if (deps["@supabase/supabase-js"]) tech.push("Supabase");

    if (deps.redux || deps["@reduxjs/toolkit"]) tech.push("Redux");
    if (deps.zustand) tech.push("Zustand");
    if (deps.jotai) tech.push("Jotai");
    if (deps.pinia) tech.push("Pinia");
    if (deps.vuex) tech.push("Vuex");
    if (deps.mobx) tech.push("MobX");
    if (deps.valtio) tech.push("Valtio");

    if (deps["next-auth"] || deps["@auth/core"]) tech.push("NextAuth.js");
    if (deps["@clerk/nextjs"]) tech.push("Clerk");
    if (deps["@auth0/auth0-react"]) tech.push("Auth0");
    if (deps.betterauth || deps["better-auth"]) tech.push("Better Auth");
    if (deps.lucia) tech.push("Lucia");

    if (deps.axios) tech.push("Axios");
    if (deps.zod) tech.push("Zod");
    if (deps.trpc || deps["@trpc/client"]) tech.push("tRPC");
    if (deps["@tanstack/react-query"]) tech.push("React Query");
    if (deps.swr) tech.push("SWR");

    if (deps["@prisma/client"]) tech.push("Prisma");
    if (deps.drizzleOrm || deps["drizzle-orm"]) tech.push("Drizzle");
    if (deps.typeorm || deps["typeorm"]) tech.push("TypeORM");
    if (deps.mongoose || deps["@mongoose"]) tech.push("Mongoose");
    if (deps.pg || deps.mysql2 || deps.betterSqlite3 || deps.sqlite3) {
      if (deps.pg) tech.push("PostgreSQL");
      if (deps.mysql2) tech.push("MySQL");
      if (deps.betterSqlite3 || deps.sqlite3) tech.push("SQLite");
    }
    if (deps.redis || deps.ioredis) tech.push("Redis");

    if (deps.stripe || deps["@stripe/stripe-js"]) tech.push("Stripe");
    if (deps["@sendgrid/mail"] || deps.nodemailer) tech.push("Email");
    if (deps.sharp) tech.push("Sharp");
    if (deps["@t3-oss/env-nextjs"] || deps["@t3-oss/env"]) tech.push("T3");

    if (deps["@sentry/nextjs"] || deps["@sentry/node"]) tech.push("Sentry");
    if (deps["@vercel/analytics"] || deps["@vercel/speed-insights"]) tech.push("Vercel Analytics");

    if (deps.shadcn || deps["@shadcn/ui"]) tech.push("shadcn/ui");
    if (deps["@headlessui/react"]) tech.push("Headless UI");
    if (deps["@radix-ui/react-dialog"] || deps["@radix-ui/react-slot"]) tech.push("Radix UI");
    if (deps["@chakra-ui/react"]) tech.push("Chakra UI");
    if (deps["@mui/material"]) tech.push("MUI");

    return tech;
  } catch {
    return [];
  }
}
