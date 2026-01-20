import { ProjectType } from "@/lib/analyzer/project-type";

export function generateInstallAndUsage(
  type: ProjectType,
  files: string[]
) {
  switch (type) {
    case "frontend":
      return {
        installation: "```bash\nnpm install\n```",
        usage: "```bash\nnpm run dev\n```",
      };

    case "node":
      return {
        installation: "```bash\nnpm install\n```",
        usage: "```bash\nnode index.js\n```",
      };

    case "python":
      return {
        installation: files.includes("requirements.txt")
          ? "```bash\npip install -r requirements.txt\n```"
          : "No installation required.",
        usage: files.includes("main.py")
          ? "```bash\npython main.py\n```"
          : "See source code for usage.",
      };

    case "embedded":
      return {
        installation:
          "This project uses PlatformIO. See the PlatformIO configuration files for setup.",
        usage:
          "Flash the firmware using PlatformIO and run it on supported hardware.",
      };
    
    case "static-web":
      return {
        installation: "No installation required.",
        usage:
            "Open the `index.html` file in a browser to run the application.",
      };


    default:
      return {
        installation: "See repository files for installation instructions.",
        usage: "See source code for usage.",
      };
  }
}
