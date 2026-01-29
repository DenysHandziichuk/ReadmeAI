export function generateInstallUsage(repoUrl: string, projectType: string) {
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

  return {
    installation: "",
  };
}
