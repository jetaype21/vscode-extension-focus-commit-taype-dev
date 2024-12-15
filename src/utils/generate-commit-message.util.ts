import * as path from "path";
import * as vscode from "vscode";

import { GoogleGenerativeAI } from "@google/generative-ai";
import simpleGit, { SimpleGit } from "simple-git";

export const sendToAIGeminiGenerateCommit = async ({
  changesSummary,
  analysis,
}: {
  changesSummary: string;
  analysis: string;
}): Promise<string | null> => {
  const key = process.env.FOCUS_COMMIT_GEMINI_API_KEY;
  console.log({
    key,
  });
  const genAI = new GoogleGenerativeAI(key!);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Eres un asistente para desarrolladores. Quiero que generes un mensaje de commit en base a los cambios del proyecto que te proporcionaré. 

      Sigue el estándar de "Conventional Commits" y que vaya de acuerdo al proyecto la cual se esta trabajando. 

      El análisis del proyecto:
      ${analysis}
      
      El mensaje final del commit debe estar en ingles.

      El mensaje debe tener la siguiente estructura:

        <tipo>[scope opcional]: <Git Emoji> <descripción del commit>

        [cuerpo del mensaje, opcional]

        [footer(s), opcionales]



      La descripción( descripción, cuerpo y footer )  del commit debe ser bastante descriptiva y explicativa, no debe superar más de 50 palabras.

      Cambios del proyecto:
      ${changesSummary}
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const response = result.response.text();
    console.log("Respuesta de Gemini AI:", response);
    return response;
  } catch (error) {
    console.error("Error al enviar datos a Gemini AI:", error);
    return null;
  }
};

export const getGitChanges = async (): Promise<string> => {
  // Obtener la carpeta del workspace actual
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    vscode.window.showErrorMessage("No hay carpeta de proyecto abierta");
    return "";
  }

  const workspaceFolder = workspaceFolders[0];

  try {
    // Inicializar simple-git en la carpeta del proyecto
    const git: SimpleGit = simpleGit(workspaceFolder.uri.fsPath);

    // Verificar si el directorio es un repositorio Git
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      vscode.window.showErrorMessage(
        "La carpeta actual no es un repositorio Git"
      );
      return "";
    }

    // Obtener archivos en el área de staging (staged)
    const status = await git.status();
    const stagedChanges = status.staged.map((file) =>
      path.relative(
        workspaceFolder.uri.fsPath,
        path.join(workspaceFolder.uri.fsPath, file)
      )
    );

    // Obtener archivos modificados pero no preparados (unstaged)
    const workingTreeChanges = status.modified.map((file) =>
      path.relative(
        workspaceFolder.uri.fsPath,
        path.join(workspaceFolder.uri.fsPath, file)
      )
    );

    // Combinar y eliminar duplicados
    const allChanges = [...new Set([...stagedChanges, ...workingTreeChanges])];

    return allChanges.join("\n");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    vscode.window.showErrorMessage(errorMessage);
    return "";
  }
};
