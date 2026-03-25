import { BadgeStyle } from "../store/readmeStore";

export const BADGES_BASE: Record<string, string> = {
  
  JavaScript: "javascript-%23F7DF1E.svg?logo=javascript&logoColor=black",
  TypeScript: "typescript-%23007ACC.svg?logo=typescript&logoColor=white",
  Python: "python-3670A0?logo=python&logoColor=ffdd54",
  Html: "html5-%23E34F26.svg?logo=html5&logoColor=white",
  Css: "css3-%231572B6.svg?logo=css3&logoColor=white",
  C: "c-%2300599C.svg?logo=c&logoColor=white",
  "C++": "c++-%2300599C.svg?logo=c%2B%2B&logoColor=white",
  Go: "go-%2300ADD8.svg?logo=go&logoColor=white",
  Rust: "rust-%23000000.svg?logo=rust&logoColor=white",
  Java: "java-%23ED8B00.svg?logo=openjdk&logoColor=white",
  Php: "php-%23777BB4.svg?logo=php&logoColor=white",
  "C#": "c%23-%23239120.svg?logo=csharp&logoColor=white",

  
  React: "react-%2361DAFB.svg?logo=react&logoColor=black",
  NextJS: "Next-black?logo=next.js&logoColor=white",
  Vue: "vuejs-%2335495e.svg?logo=vuedotjs&logoColor=%234FC08D",
  Angular: "angular-%23DD0031.svg?logo=angular&logoColor=white",
  Svelte: "svelte-%23FF3E00.svg?logo=svelte&logoColor=white",
  Nuxt: "nuxtjs-%2300DC82.svg?logo=nuxtdotjs&logoColor=white",
  Astro: "astro-%23ff5d01.svg?logo=astro&logoColor=white",

  
  TailwindCSS: "tailwindcss-%2338B2AC.svg?logo=tailwind-css&logoColor=white",
  Bootstrap: "bootstrap-%238511FA.svg?logo=bootstrap&logoColor=white",

  
  Node: "node.js-6DA55F?logo=node.js&logoColor=white",
  Deno: "deno%20js-000000?logo=deno&logoColor=white",
  Bun: "Bun-%23000000.svg?logo=bun&logoColor=white",

  
  Express: "express.js-%23404d59.svg?logo=express&logoColor=%2361DAFB",
  FastAPI: "FastAPI-005571?logo=fastapi",
  Django: "django-%23092E20.svg?logo=django&logoColor=white",
  Flask: "flask-%23000.svg?logo=flask&logoColor=white",
  NestJS: "nestjs-%23E0234E.svg?logo=nestjs&logoColor=white",
  Spring: "spring-%236DB33F.svg?logo=spring&logoColor=white",
  Laravel: "laravel-%23FF2D20.svg?logo=laravel&logoColor=white",
  Fastify: "fastify-000000?logo=fastify&logoColor=white",
  Gin: "gin-%2300ADD8.svg?logo=go&logoColor=white",
  Actix: "actix-000000?logo=rust&logoColor=white",

  
  Redux: "redux-%23593d88.svg?logo=redux&logoColor=white",
  Zustand: "zustand-%2320232a.svg?logo=react&logoColor=white",
  Pinia: "pinia-%23ae9142.svg?logo=pinia&logoColor=white",

  
  npm: "NPM-%23CB3837.svg?logo=npm&logoColor=white",
  pnpm: "pnpm-%234a4a4a.svg?logo=pnpm&logoColor=f69220",
  yarn: "yarn-%232C8EBB.svg?logo=yarn&logoColor=white",
  Vite: "vite-%23646CFF.svg?logo=vite&logoColor=white",
  Webpack: "webpack-%238DD6F9.svg?logo=webpack&logoColor=black",

  
  PostgreSQL: "postgres-%23316192.svg?logo=postgresql&logoColor=white",
  MySQL: "mysql-4479A1.svg?logo=mysql&logoColor=white",
  MongoDB: "MongoDB-%234ea94b.svg?logo=mongodb&logoColor=white",
  SQLite: "sqlite-%2307405e.svg?logo=sqlite&logoColor=white",
  Redis: "redis-%23DD0031.svg?logo=redis&logoColor=white",
  Supabase: "supabase-%233FCF8E.svg?logo=supabase&logoColor=white",
  Firebase: "firebase-%23FFCA28.svg?logo=firebase&logoColor=black",
  Prisma: "prisma-%232D3748.svg?logo=prisma&logoColor=white",

  
  Docker: "docker-%230db7ed.svg?logo=docker&logoColor=white",
  Kubernetes: "kubernetes-%23326CE5.svg?logo=kubernetes&logoColor=white",
  Nginx: "nginx-%23009639.svg?logo=nginx&logoColor=white",
  Vercel: "vercel-%23000000.svg?logo=vercel&logoColor=white",
  Netlify: "netlify-%2300C7B7.svg?logo=netlify&logoColor=white",
  "GitHub Actions": "github%20actions-%232671E5.svg?logo=githubactions&logoColor=white",

  
  "NextAuth.js": "nextauth.js-%23000000.svg?logo=next.js&logoColor=white",
  Clerk: "clerk-%236C47FF.svg?logo=clerk&logoColor=white",
  Auth0: "auth0-%23EB5424.svg?logo=auth0&logoColor=white",

  
  Jest: "-jest-%23C21325?logo=jest&logoColor=white",
  Vitest: "-Vitest-252529?logo=vitest&logoColor=FCC72B",
  Playwright: "-playwright-%232EAD33?logo=playwright&logoColor=white",
  ESLint: "ESLint-4B3263?logo=eslint&logoColor=white",
  Prettier: "prettier-%23F7B93E.svg?logo=prettier&logoColor=black",

  
  Husky: "husky-%23000000.svg?logo=husky&logoColor=white",
  Axios: "axios-%235A29E4.svg?logo=axios&logoColor=white",
  Zod: "zod-%233E67B1.svg?logo=zod&logoColor=white",
  tRPC: "trpc-%232596be.svg?logo=trpc&logoColor=white",
  "React Query": "-react%20query-FF4154?logo=react-query&logoColor=white",

  
  MIT: "License-MIT-yellow.svg",
  Apache: "License-Apache%202.0-blue.svg",
  GPL: "License-GPLv3-blue.svg",
  UNLICENSE: "License-Unlicense-blue.svg",
};

export function generateBadges(tech: string[], style: BadgeStyle = "for-the-badge") {
  return tech
    .map((t) => {
      const base = BADGES_BASE[t];
      if (!base) return null;
      const url = `https://img.shields.io/badge/${base}${base.includes("?") ? "&" : "?"}style=${style}`;
      return `![${t}](${url})`;
    })
    .filter(Boolean)
    .join("\n");
}
