import OpenAI from "openai";

export const sendToAI = async (projectSummary: string) => {
  const openai = new OpenAI({
    apiKey: "",
  });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // O el modelo que prefieras
      messages: [
        {
          role: "system",
          content: "Eres un experto analizando proyectos de software.",
        },
        { role: "user", content: projectSummary },
      ],
    });

    console.log("Respuesta de la IA:", completion.choices[0].message.content);
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error al enviar datos a la IA:", error);
    return null;
  }
};
