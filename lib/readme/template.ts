type ReadmeTemplateInput = {
  title: string;
  badges: string;
  techStack: string;
  description: string;
  features: string;
  installation: string;
  usage: string;
};

export function buildReadmeTemplate({
  title,
  badges,
  techStack,
  description,
  features,
  installation,
  usage,
}: ReadmeTemplateInput): string {
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
