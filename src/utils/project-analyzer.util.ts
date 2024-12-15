import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

import {
  IGNORE_DIRS_CONSTANT,
  IGNORED_EXTENSIONS_CONSTANT,
} from "../common/constants";
import { FileNode, ProjectStructure } from "../common/entities";

export class ProjectAnalyzer {
  private ignoredDirs = IGNORE_DIRS_CONSTANT;
  private ignoredExtensions = IGNORED_EXTENSIONS_CONSTANT;

  async analyzeProject(rootPath: string): Promise<ProjectStructure> {
    //! Asignando un árbol de archivos por defectos
    const fileTree = (await this.createFileTree(rootPath)) ?? {
      name: path.basename(rootPath),
      type: "directory",
      path: rootPath,
      children: [],
    };

    /*
      OTRA POSIBLE SOLUCIÓN
      if (fileTree === null) {
          throw new Error('No se pudo crear el árbol de archivos del proyecto');
      }
    */

    const projectType = this.detectProjectType(fileTree);
    const mainLanguages = this.detectMainLanguages(fileTree);

    return {
      rootDir: rootPath,
      fileTree,
      projectType,
      mainLanguages,
    };
  }

  private async createFileTree(
    dirPath: string,
    basePath: string = dirPath
  ): Promise<FileNode | null> {
    const stats = await fs.promises.stat(dirPath);
    const fileName = path.basename(dirPath);

    // Ignorar directorios específicos
    if (this.ignoredDirs.includes(fileName)) {
      return null;
    }

    const node: FileNode = {
      name: fileName,
      type: stats.isDirectory() ? "directory" : "file",
      path: path.relative(basePath, dirPath),
      size: stats.size,
    };

    // Si es un archivo, añadir extensión
    if (node.type === "file") {
      node.extension = path.extname(dirPath);

      // Ignorar extensiones no deseadas
      if (this.ignoredExtensions.some((ext) => dirPath.endsWith(ext))) {
        return null;
      }
    }

    // Si es directorio, añadir hijos
    if (node.type === "directory") {
      try {
        const children = await fs.promises.readdir(dirPath);
        node.children = (
          await Promise.all(
            children.map((child) =>
              this.createFileTree(path.join(dirPath, child), basePath)
            )
          )
        ).filter((child) => child !== null);
      } catch (error) {
        // Manejar errores de lectura de directorio
        console.error(`Error leyendo directorio ${dirPath}:`, error);
        return null;
      }
    }

    return node;
  }

  private detectProjectType(fileTree: FileNode): string {
    if (!fileTree) {
      return "generic";
    }

    const checkFiles = (node: FileNode): string[] => {
      if (!node.children) {
        return [];
      }

      const types: string[] = [];

      for (const child of node.children) {
        if (child.name === "package.json") {
          types.push("npm");
        }
        if (child.name === "requirements.txt") {
          types.push("python");
        }
        if (child.name === "pom.xml") {
          types.push("maven");
        }
        if (child.name === "go.mod") {
          types.push("go");
        }
      }

      return types;
    };

    const projectTypes = checkFiles(fileTree);
    return projectTypes.length > 0 ? projectTypes.join(", ") : "generic";
  }

  private detectMainLanguages(fileTree: FileNode | null): string[] {
    // Definir un objeto más completo de extensiones de lenguajes
    const languageCounters: { [key: string]: number } = {
      JavaScript: 0,
      TypeScript: 0,
      React: 0,
      Vue: 0,
      Angular: 0,
      Python: 0,
      Java: 0,
      Go: 0,
      Ruby: 0,
      Rust: 0,
      Svelte: 0,
      Kotlin: 0,
      Swift: 0,
    };

    // Función para detectar framework o lenguaje más específico
    const detectFrameworkOrLanguage = (node: FileNode) => {
      if (!node || node.type !== "file") {
        return;
      }

      const fileName = node.name.toLowerCase();
      const extension = node.extension?.toLowerCase() ?? "";

      // Detección de lenguajes y frameworks más compleja
      const languageDetectors = [
        // JavaScript y variantes
        {
          extensions: [".js", ".mjs", ".cjs", ".jsx"],
          language: "React",
          check: () => fileName.includes("react") || extension === ".jsx",
        },
        {
          extensions: [".js", ".mjs", ".cjs"],
          language: "JavaScript",
          check: () => true, // Fallback para JavaScript
        },
        // TypeScript y variantes
        {
          extensions: [".ts", ".tsx"],
          language: "React TypeScript",
          check: () => extension === ".tsx" || fileName.includes("react"),
        },
        {
          extensions: [".ts"],
          language: "TypeScript",
          check: () => true, // Fallback para TypeScript
        },
        // Frameworks frontend
        {
          extensions: [".vue"],
          language: "Vue",
          check: () => true,
        },
        {
          extensions: [".svelte"],
          language: "Svelte",
          check: () => true,
        },
        // Otros lenguajes
        {
          extensions: [".py"],
          language: "Python",
          check: () => true,
        },
        {
          extensions: [".java"],
          language: "Java",
          check: () => true,
        },
        {
          extensions: [".go"],
          language: "Go",
          check: () => true,
        },
        {
          extensions: [".rs"],
          language: "Rust",
          check: () => true,
        },
        {
          extensions: [".kt"],
          language: "Kotlin",
          check: () => true,
        },
        {
          extensions: [".swift"],
          language: "Swift",
          check: () => true,
        },
      ];

      // Buscar coincidencias
      for (const detector of languageDetectors) {
        if (detector.extensions.includes(extension) && detector.check()) {
          languageCounters[detector.language]++;
          break;
        }
      }
    };

    // Función recursiva para recorrer todo el árbol
    const traverseFileTree = (node: FileNode | null) => {
      if (!node) {
        return;
      }

      detectFrameworkOrLanguage(node);

      if (node.children) {
        node.children.forEach(traverseFileTree);
      }
    };

    // Si el árbol es nulo, devolver un array vacío
    if (!fileTree) {
      return [];
    }

    // Iniciar el recorrido
    traverseFileTree(fileTree);

    // Obtener los lenguajes principales
    return Object.entries(languageCounters)
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3) // Aumentar a 3 para más contexto
      .map(([lang, _]) => lang);
  }

  // Método para mostrar un resumen del análisis más detallado
  displayProjectSummary(projectStructure: ProjectStructure) {
    const outputChannel = vscode.window.createOutputChannel(
      "Análisis de Proyecto"
    );
    outputChannel.clear();

    // Encabezado más elaborado
    outputChannel.appendLine("🔍 Análisis Detallado del Proyecto 🔍");
    outputChannel.appendLine("=".repeat(40));

    // Información básica
    outputChannel.appendLine(`📂 Directorio Raíz: ${projectStructure.rootDir}`);
    outputChannel.appendLine(
      `🏗️ Tipo de Proyecto: ${projectStructure.projectType}`
    );

    // Lenguajes con más detalle
    outputChannel.appendLine("💻 Lenguajes Principales:");
    projectStructure.mainLanguages.forEach((lang, index) => {
      outputChannel.appendLine(`   ${index + 1}. ${lang}`);
    });

    // Información adicional
    outputChannel.appendLine("\n📝 Notas Adicionales:");
    outputChannel.appendLine(
      "   - El análisis incluye detección de frameworks"
    );
    outputChannel.appendLine(
      "   - Los lenguajes se detectan por extensiones y contenido"
    );

    outputChannel.show();
  }
}
