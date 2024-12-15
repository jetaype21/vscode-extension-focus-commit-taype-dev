import { GoogleGenerativeAI } from "@google/generative-ai";

export const sendToAIGemini = async (projectSummary: string) => {
  const key = process.env.FOCUS_COMMIT_GEMINI_API_KEY;
  console.log({
    key,
  });

  const genAI = new GoogleGenerativeAI(key!);

  try {
    // Define el modelo Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Envía el prompt al modelo
    const prompt = `
    Analiza el siguiente resumen de un proyecto para proporcionar una descripción general.
    Detalla de qué trata el proyecto y su propósito principal.
    Resumen del proyecto:
    ${projectSummary}
  `;
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    // Obtiene la respuesta
    const response = result.response.text();
    console.log("Respuesta de Gemini AI:", response);
    return response;
  } catch (error) {
    console.error("Error al enviar datos a Gemini AI:", error);
    return null;
  }
};
