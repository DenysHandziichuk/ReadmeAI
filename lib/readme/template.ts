export function buildReadmeTemplate({
  title,
  badges,
  description,
  features,
  installation,
  usage,
}: {
  title: string;
  badges: string;
  description: string;
  features: string;
  installation: string;
  usage: string;
}) {
  return `# ${title}

${badges}

## 📄 Description
${description}

## ✨ Features
${features}

## 📦 Installation
${installation}

## 🚀 Usage
${usage}
`;
}
