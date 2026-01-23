export function generateInstallUsage(repoUrl: string, projectType: string) {
  // ----------------------------
  // Frontend (React/Vite/Next)
  // ----------------------------
  if (projectType === "frontend") {
    return {
      installation: `
## 🧩 Installation & Usage

\`\`\`bash
git clone ${repoUrl}
cd {{REPO_NAME}}
npm install
npm run dev
\`\`\`

Then open:

http://localhost:{{PORT}}
`,
    };
  }

  // ----------------------------
  // Python project
  // ----------------------------
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

  // ----------------------------
  // C project
  // ----------------------------
  if (projectType === "c") {
    return {
      installation: `
## 🧩 Installation & Usage

\`\`\`bash
git clone ${repoUrl}
cd {{REPO_NAME}}

gcc main.c -o app
./app
\`\`\`
`,
    };
  }

  // ----------------------------
  // Default fallback
  // ----------------------------
  return {
    installation: "",
  };
}
