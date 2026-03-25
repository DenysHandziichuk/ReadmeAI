export function generateInstallUsage(repoUrl: string, projectType: string) {
  if (projectType === "frontend" || projectType === "node") {
    const runCmd = projectType === "frontend" ? "npm run dev" : "npm start";
    return {
      installation: `
## 🧩 Installation & Usage

\`\`\`bash
git clone ${repoUrl}
cd {{REPO_NAME}}
npm install
${runCmd}
\`\`\`
`,
    };
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

  if (projectType === "python") {
    return {
      installation: `
## 🧩 Installation & Usage

\`\`\`bash
git clone ${repoUrl}
cd {{REPO_NAME}}

python -m venv venv
source venv/bin/activate   # Linux/Mac
venv\\Scripts\\activate    # Windows

pip install -r requirements.txt
python main.py
\`\`\`
`,
    };
  }

  return {
    installation: "",
  };
}
