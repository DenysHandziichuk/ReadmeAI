export function generateInstallUsage(repoUrl: string, projectType: string, packageManager: string | null = null) {
  if (projectType === "frontend" || projectType === "node") {
    const pkgCmd = packageManager === "pnpm" ? "pnpm install" : packageManager === "yarn" ? "yarn" : packageManager === "Bun" ? "bun install" : "npm install";
    const runCmd = projectType === "frontend" ? (packageManager === "pnpm" ? "pnpm dev" : packageManager === "yarn" ? "yarn dev" : packageManager === "Bun" ? "bun run dev" : "npm run dev") : (packageManager === "pnpm" ? "pnpm start" : packageManager === "yarn" ? "yarn start" : packageManager === "Bun" ? "bun start" : "npm start");
    return {
      installation: `
## 🧩 Installation & Usage

\`\`\`bash
git clone ${repoUrl}
cd {{REPO_NAME}}
${pkgCmd}
${runCmd}
\`\`\`
`,
    };
  }

  if (projectType === "fullstack" && packageManager !== "poetry" && packageManager !== "pip" && packageManager !== "pipenv" && packageManager !== "uv" && packageManager !== "cargo" && packageManager !== "go" && packageManager !== "bundler") {
    const pkgCmd = packageManager === "pnpm" ? "pnpm install" : packageManager === "yarn" ? "yarn" : packageManager === "Bun" ? "bun install" : "npm install";
    const devCmd = packageManager === "pnpm" ? "pnpm dev" : packageManager === "yarn" ? "yarn dev" : packageManager === "Bun" ? "bun run dev" : "npm run dev";
    return {
      installation: `
## 🧩 Installation & Usage

\`\`\`bash
git clone ${repoUrl}
cd {{REPO_NAME}}
${pkgCmd}
${devCmd}
\`\`\`
`,
    };
  }

  if (projectType === "api" || projectType === "backend") {
    if (packageManager === "poetry" || packageManager === "pip" || packageManager === "pipenv" || packageManager === "uv") {
      return generatePythonInstall(repoUrl, packageManager);
    }

    const pkgCmd = packageManager === "pnpm" ? "pnpm install" : packageManager === "yarn" ? "yarn" : packageManager === "Bun" ? "bun install" : "npm install";
    const devCmd = packageManager === "pnpm" ? "pnpm dev" : packageManager === "yarn" ? "yarn dev" : packageManager === "Bun" ? "bun run dev" : "npm run dev";
    return {
      installation: `
## 🧩 Installation & Usage

\`\`\`bash
git clone ${repoUrl}
cd {{REPO_NAME}}
${pkgCmd}
${devCmd}
\`\`\`
`,
    };
  }

  if (projectType === "python" || projectType === "library") {
    if (packageManager === "poetry" || packageManager === "pip" || packageManager === "pipenv" || packageManager === "uv") {
      return generatePythonInstall(repoUrl, packageManager);
    }
  }

  if (projectType === "cli") {
    if (packageManager === "poetry" || packageManager === "pip" || packageManager === "pipenv" || packageManager === "uv") {
      return generatePythonInstall(repoUrl, packageManager);
    }
    if (packageManager === "cargo") {
      return {
        installation: `
## 🧩 Installation & Usage

\`\`\`bash
git clone ${repoUrl}
cd {{REPO_NAME}}
cargo build --release
cargo run
\`\`\`
`,
      };
    }
  }

  if (projectType === "rust") {
    return {
      installation: `
## 🧩 Installation & Usage

\`\`\`bash
git clone ${repoUrl}
cd {{REPO_NAME}}
cargo build --release
cargo run
\`\`\`
`,
    };
  }

  if (projectType === "go") {
    return {
      installation: `
## 🧩 Installation & Usage

\`\`\`bash
git clone ${repoUrl}
cd {{REPO_NAME}}
go build -o app
./app
\`\`\`
`,
    };
  }

  if (projectType === "static") {
    return {
      installation: `
## 🧩 Installation & Usage

Just open \`index.html\` in your browser or use a local server:

\`\`\`bash
npx live-server
\`\`\`
`,
    };
  }

  if (projectType === "mobile") {
    return {
      installation: `
## 🧩 Installation & Usage

\`\`\`bash
git clone ${repoUrl}
cd {{REPO_NAME}}
npm install
npx expo start
\`\`\`
`,
    };
  }

  if (projectType === "desktop") {
    if (packageManager === "cargo") {
      return {
        installation: `
## 🧩 Installation & Usage

\`\`\`bash
git clone ${repoUrl}
cd {{REPO_NAME}}
cargo tauri dev
\`\`\`
`,
      };
    }
    return {
      installation: `
## 🧩 Installation & Usage

\`\`\`bash
git clone ${repoUrl}
cd {{REPO_NAME}}
npm install
npm run tauri dev
\`\`\`
`,
    };
  }

  if (projectType === "monorepo") {
    const pkgCmd = packageManager === "pnpm" ? "pnpm install" : packageManager === "yarn" ? "yarn" : "npm install";
    return {
      installation: `
## 🧩 Installation & Usage

\`\`\`bash
git clone ${repoUrl}
cd {{REPO_NAME}}
${pkgCmd}
\`\`\`
`,
    };
  }

  if (projectType === "java") {
    return {
      installation: `
## 🧩 Installation & Usage

\`\`\`bash
git clone ${repoUrl}
cd {{REPO_NAME}}
${packageManager === "gradle" ? "./gradlew build" : "mvn install"}
\`\`\`
`,
    };
  }

  if (projectType === "ruby") {
    return {
      installation: `
## 🧩 Installation & Usage

\`\`\`bash
git clone ${repoUrl}
cd {{REPO_NAME}}
bundle install
rails server
\`\`\`
`,
    };
  }

  if (projectType === "php") {
    return {
      installation: `
## 🧩 Installation & Usage

\`\`\`bash
git clone ${repoUrl}
cd {{REPO_NAME}}
composer install
php artisan serve
\`\`\`
`,
    };
  }

  return { installation: "" };
}

function generatePythonInstall(repoUrl: string, packageManager: string | null) {
  if (packageManager === "poetry") {
    return {
      installation: `
## 🧩 Installation & Usage

\`\`\`bash
git clone ${repoUrl}
cd {{REPO_NAME}}

python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\\Scripts\\activate   # Windows

poetry install
poetry run python main.py
\`\`\`
`,
    };
  }

  if (packageManager === "pipenv") {
    return {
      installation: `
## 🧩 Installation & Usage

\`\`\`bash
git clone ${repoUrl}
cd {{REPO_NAME}}

pipenv install
pipenv run python main.py
\`\`\`
`,
    };
  }

  if (packageManager === "uv") {
    return {
      installation: `
## 🧩 Installation & Usage

\`\`\`bash
git clone ${repoUrl}
cd {{REPO_NAME}}

uv venv
source .venv/bin/activate  # Linux/Mac
.venv\\Scripts\\activate   # Windows

uv pip install -r requirements.txt
python main.py
\`\`\`
`,
    };
  }

  return {
    installation: `
## 🧩 Installation & Usage

\`\`\`bash
git clone ${repoUrl}
cd {{REPO_NAME}}

python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\\Scripts\\activate   # Windows

pip install -r requirements.txt
python main.py
\`\`\`
`,
  };
}
