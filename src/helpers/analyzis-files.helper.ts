import * as fs from "fs/promises";
import * as path from "path";
import * as vscode from "vscode";

import { ANALYSIS_FILE_NAME } from "../common/constants";

const getAnalysisFilePath = (): string | undefined => {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    vscode.window.showErrorMessage("No hay carpeta de proyecto abierta");
    return undefined;
  }
  return path.join(workspaceFolders[0].uri.fsPath, ANALYSIS_FILE_NAME);
};

const getGitIgnoreFilePath = (): string | undefined => {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    vscode.window.showErrorMessage("No hay carpeta de proyecto abierta");
    return undefined;
  }
  return path.join(workspaceFolders[0].uri.fsPath, ".gitignore");
};

const addToGitIgnore = async (filePath: string): Promise<void> => {
  const gitIgnorePath = getGitIgnoreFilePath();
  if (!gitIgnorePath) {
    return;
  }

  try {
    const gitIgnoreContent = await fs.readFile(gitIgnorePath, "utf-8");

    // Verificar si el archivo ya está en el .gitignore
    if (!gitIgnoreContent.includes(filePath)) {
      await fs.appendFile(
        gitIgnorePath,
        `\n# Ignorar archivo de análisis\n${filePath}\n`
      );
      vscode.window.showInformationMessage(
        `El archivo ${filePath} ha sido añadido a .gitignore.`
      );
    } else {
      vscode.window.showInformationMessage(
        `El archivo ${filePath} ya está en .gitignore.`
      );
    }
  } catch (error) {
    vscode.window.showErrorMessage(
      `Error al actualizar el .gitignore: ${(error as Error).message}`
    );
  }
};

export const saveAnalysisToFile = async (analysis: string): Promise<void> => {
  const filePath = getAnalysisFilePath();
  if (!filePath) {
    return;
  }

  try {
    await fs.writeFile(filePath, analysis, "utf-8");
    vscode.window.showInformationMessage(
      "El análisis del proyecto se guardó correctamente."
    );
    await addToGitIgnore(ANALYSIS_FILE_NAME);
  } catch (error) {
    vscode.window.showErrorMessage(
      `Error al guardar el análisis: ${(error as Error).message}`
    );
  }
};

export const loadAnalysisFromFile = async (): Promise<string | null> => {
  const filePath = getAnalysisFilePath();
  if (!filePath) {
    return null;
  }

  try {
    const content = await fs.readFile(filePath, "utf-8");
    return content;
  } catch {
    return null; // Archivo no encontrado o no accesible
  }
};
