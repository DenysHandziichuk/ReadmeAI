const BADGES: Record<string, { label: string; logo: string; color: string }> = {
  // Core Languages
  JavaScript:  { label: "JavaScript",  logo: "javascript",  color: "F7DF1E" },
  TypeScript:  { label: "TypeScript",  logo: "typescript",  color: "3178C6" },
  Python:      { label: "Python",      logo: "python",      color: "3776AB" },
  HTML:        { label: "HTML",        logo: "html5",       color: "E34F26" },
  CSS:         { label: "CSS",         logo: "css3",        color: "1572B6" },
  C:           { label: "C",           logo: "c",           color: "A8B9CC" },
  "C++":       { label: "C++",         logo: "cplusplus",   color: "00599C" },
  Go:          { label: "Go",          logo: "go",          color: "00ADD8" },
  Rust:        { label: "Rust",        logo: "rust",        color: "000000" },
  Java:        { label: "Java",        logo: "openjdk",     color: "ED8B00" },
  PHP:         { label: "PHP",         logo: "php",         color: "777BB4" },
  Shell:       { label: "Shell",       logo: "gnubash",     color: "4EAA25" },

  // Frontend Frameworks
  React:       { label: "React",       logo: "react",       color: "61DAFB" },
  NextJS:      { label: "Next.js",     logo: "nextdotjs",   color: "000000" },
  Vue:         { label: "Vue.js",      logo: "vuedotjs",    color: "4FC08D" },
  Svelte:      { label: "Svelte",      logo: "svelte",      color: "FF3E00" },
  Angular:     { label: "Angular",     logo: "angular",     color: "DD0031" },

  // Styling / UI
  TailwindCSS: { label: "Tailwind CSS", logo: "tailwindcss", color: "06B6D4" },
  Bootstrap:   { label: "Bootstrap",   logo: "bootstrap",   color: "7952B3" },
  Sass:        { label: "Sass",        logo: "sass",        color: "CC6699" },

  // Backend / Runtimes
  Node:        { label: "Node.js",     logo: "nodedotjs",   color: "339933" },
  Deno:        { label: "Deno",        logo: "deno",        color: "000000" },
  Bun:         { label: "Bun",         logo: "bun",         color: "000000" },

  // Backend Frameworks
  Express:     { label: "Express",     logo: "express",     color: "000000" },
  FastAPI:     { label: "FastAPI",     logo: "fastapi",     color: "009688" },
  Django:      { label: "Django",      logo: "django",      color: "092E20" },
  Flask:       { label: "Flask",       logo: "flask",       color: "000000" },
  NestJS:      { label: "NestJS",      logo: "nestjs",      color: "E0234E" },

  // Package Managers / Build Tools
  npm:         { label: "npm",         logo: "npm",         color: "CB3837" },
  pnpm:        { label: "pnpm",        logo: "pnpm",        color: "F69220" },
  yarn:        { label: "Yarn",        logo: "yarn",        color: "2C8EBB" },
  Vite:        { label: "Vite",        logo: "vite",        color: "646CFF" },
  Webpack:     { label: "Webpack",     logo: "webpack",     color: "8DD6F9" },

  // Embedded / Systems
  Arduino:     { label: "Arduino",     logo: "arduino",     color: "00979D" },
  PlatformIO:  { label: "PlatformIO",  logo: "platformio",  color: "F5822A" },
  ESP32:       { label: "ESP32",       logo: "espressif",   color: "E7352C" },

  // Databases (optional but nice)
  PostgreSQL:  { label: "PostgreSQL",  logo: "postgresql",  color: "4169E1" },
  MySQL:       { label: "MySQL",       logo: "mysql",       color: "4479A1" },
  MongoDB:     { label: "MongoDB",     logo: "mongodb",     color: "47A248" },
  SQLite:      { label: "SQLite",      logo: "sqlite",      color: "003B57" },
  Redis:       { label: "Redis",       logo: "redis",       color: "DC382D" },

  // Testing / Tools (optional)
  Jest:        { label: "Jest",        logo: "jest",        color: "C21325" },
  Vitest:      { label: "Vitest",      logo: "vitest",      color: "6E9F18" },
  Playwright:  { label: "Playwright",  logo: "playwright",  color: "2EAD33" },
  ESLint:      { label: "ESLint",      logo: "eslint",      color: "4B32C3" },
  Prettier:    { label: "Prettier",    logo: "prettier",    color: "F7B93E" },
};
