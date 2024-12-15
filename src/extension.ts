import * as vscode from "vscode";

import {
  loadAnalysisFromFile,
  saveAnalysisToFile,
} from "./helpers/analyzis-files.helper";
import { sendToAIGemini } from "./repositories/send-to-AI-GEMINI.repository";
import {
  getGitChanges,
  sendToAIGeminiGenerateCommit,
} from "./utils/generate-commit-message.util";
import { ProjectSummarizerAI } from "./utils/project-summarizer-AI.util";

const generateCommitWithAI = async () => {
  try {
    let analysis = await loadAnalysisFromFile();

    // Si no se encuentra el análisis, generar uno nuevo y guardarlo
    if (!analysis) {
      vscode.window.showInformationMessage(
        "No se encontró análisis del proyecto. Generando uno nuevo..."
      );

      analysis = (await analyzeProjectWithAI()) ?? "";

      if (analysis) {
        await saveAnalysisToFile(analysis);
        vscode.window.showInformationMessage("Análisis generado y guardado.");
      } else {
        vscode.window.showErrorMessage("No se pudo generar el análisis.");
        return;
      }
    }

    const changes = await getGitChanges();
    if (!changes) {
      vscode.window.showWarningMessage(
        "No hay cambios en el área de preparación."
      );
      return;
    }

    const commitMessage = await sendToAIGeminiGenerateCommit({
      changesSummary: changes,
      analysis,
    });

    if (commitMessage) {
      vscode.window.showInformationMessage(
        `Mensaje generado: ${commitMessage}`
      );

      const sourceControl = vscode.scm.createSourceControl(
        "projectAnalyzer",
        "Commit"
      );

      if (sourceControl && sourceControl.inputBox) {
        sourceControl.inputBox.value = commitMessage;
        vscode.window.showInformationMessage(
          "FOCUS COMMIT: Mensaje de commit generado"
        );
        return;
      }

      const terminal = vscode.window.createTerminal("Focus commit");
      terminal.show();
      terminal.sendText(`# Mensaje de commit generado`);
      terminal.sendText(`echo "${commitMessage}"`);
      vscode.window.showWarningMessage(
        "No se encontró Source Control. Se creó un terminal con el mensaje."
      );
    } else {
      vscode.window.showErrorMessage(
        "No se pudo generar un mensaje de commit."
      );
    }
  } catch (error) {
    vscode.window.showErrorMessage(
      `Error generando commit: ${(error as Error).message}`
    );
  }
};

const analyzeProjectWithAI = async () => {
  const projectPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!projectPath) {
    vscode.window.showErrorMessage("No hay carpeta de proyecto abierta");
    return;
  }

  const existingAnalysis = await loadAnalysisFromFile();

  if (existingAnalysis) {
    vscode.window.showInformationMessage(
      "Ya existe un análisis del proyecto. Usando el análisis almacenado."
    );
    return existingAnalysis;
  }

  const summarizer = new ProjectSummarizerAI();
  try {
    const projectSummary = await summarizer.summarizeProject(projectPath);

    const aiAnalysis = await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "Analizando Proyecto con IA...",
        cancellable: false,
      },
      async () => {
        return await sendToAIGemini(projectSummary);
      }
    );

    if (aiAnalysis) {
      await saveAnalysisToFile(aiAnalysis);
      vscode.window.showInformationMessage(
        "Análisis completado y guardado. Consulta la salida."
      );
      const outputChannel = vscode.window.createOutputChannel("Análisis IA");
      outputChannel.clear();
      outputChannel.appendLine("🔍 Análisis del Proyecto por la IA 🔍");
      outputChannel.appendLine(aiAnalysis);
      outputChannel.show();
    } else {
      vscode.window.showErrorMessage("La IA no pudo analizar el proyecto.");
    }

    return aiAnalysis;
  } catch (error: unknown) {
    vscode.window.showErrorMessage(
      `Error analizando proyecto: ${(error as Error).message}`
    );
    return null;
  }
};

export function activate(context: vscode.ExtensionContext) {
  const analyzeProjectWithAICommand = vscode.commands.registerCommand(
    "projectAnalyzer.analyzeWithAI",
    async () => {
      await analyzeProjectWithAI();
    }
  );

  const generateCommitWithAICommand = vscode.commands.registerCommand(
    "projectAnalyzer.generateCommitWithAI",
    async () => {
      await generateCommitWithAI();
    }
  );

  context.subscriptions.push(analyzeProjectWithAICommand);
  context.subscriptions.push(generateCommitWithAICommand);
}

export function deactivate() {}
