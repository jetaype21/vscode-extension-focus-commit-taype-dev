import * as fs from "fs";
import * as path from "path";
import { IGNORE_DIRS_CONSTANT } from "../common/constants";

export class ProjectSummarizerAI {
  private readonly MAX_FILE_SIZE = 40000; // Máximo tamaño de archivo (40 KB)

  private readonly ignorePatterns: RegExp = new RegExp(
    IGNORE_DIRS_CONSTANT.map((pattern) =>
      pattern
        .replace(/\./g, "\\.")
        .replace(/\*\*/g, ".*")
        .replace(/\*/g, "[^/]*")
    ).join("|")
  );

  async summarizeProject(rootPath: string): Promise<string> {
    const summaries: string[] = [];
    await this.processDirectory(rootPath, summaries);

    const technologies = this.detectTechnologies(summaries.join("\n"));
    const overview = `
      Este proyecto parece estar desarrollado utilizando las siguientes tecnologías: ${technologies.join(
        ", "
      )}.
      Se compone de los siguientes archivos clave:
    `;

    return `${overview}\n\n${summaries.join("\n\n")}`;
  }

  private async processDirectory(
    dirPath: string,
    summaries: string[]
  ): Promise<void> {
    const files = await fs.promises.readdir(dirPath, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(dirPath, file.name);

      // Omitir archivos y carpetas según los patrones de exclusión
      if (this.shouldIgnore(fullPath, file.isDirectory())) {
        continue;
      }

      if (file.isDirectory()) {
        await this.processDirectory(fullPath, summaries);
      } else {
        const fileSummary = await this.processFile(fullPath);
        if (fileSummary) {
          summaries.push(fileSummary);
        }
      }
    }
  }

  private async processFile(filePath: string): Promise<string | null> {
    const stats = await fs.promises.stat(filePath);

    if (stats.size > this.MAX_FILE_SIZE) {
      // Archivos muy grandes se resumen indicando su nombre
      return `El archivo ${filePath} es demasiado grande para ser procesado.`;
    }

    const content = await fs.promises.readFile(filePath, "utf-8");
    return `Archivo: ${filePath}\nContenido:\n${content}`;
  }

  private detectTechnologies(content: string): string[] {
    const techKeywords = [
      { keyword: "react", tech: "React" },
      { keyword: "next", tech: "Next.js" },
      { keyword: "firebase", tech: "Firebase" },
      { keyword: "tailwind", tech: "Tailwind CSS" },
      { keyword: "typescript", tech: "TypeScript" },
      { keyword: "node", tech: "Node.js" },
      { keyword: "express", tech: "Express.js" },
    ];

    return techKeywords
      .filter((item) => content.toLowerCase().includes(item.keyword))
      .map((item) => item.tech);
  }

  private shouldIgnore(filePath: string, isDirectory: boolean): boolean {
    const relativePath = filePath.replace(/\\/g, "/"); // Compatibilidad con Windows
    return (
      this.ignorePatterns.test(relativePath) ||
      (isDirectory && IGNORE_DIRS_CONSTANT.includes(filePath))
    );
  }
}
