import { GoogleGenAI } from "@google/genai";

export async function POST(request) {
  try {
    const body = await request.json();

    const question = String(
      body?.question || body?.situation || ""
    ).trim();

    const language = String(body?.language || "English");

    if (!question) {
      return Response.json(
        { error: "Please enter a question." },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { error: "GEMINI_API_KEY is missing." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: `
You are LifeLens AI.

Answer this everyday question clearly and helpfully.

Question:
${question}

Language:
${language}

Give the answer in ${language}.
Keep it simple and practical.
Use bullet points when useful.
`,
    });

    const result = response?.text?.trim();

    if (!result) {
      return Response.json(
        { error: "LifeLens AI returned an empty answer." },
        { status: 502 }
      );
    }

    return Response.json({
      result: result,
    });
  } catch (error) {
    console.error("ASK ERROR:", error);

    return Response.json(
      {
        error:
          error?.message ||
          "LifeLens AI could not answer your question.",
      },
      { status: 500 }
    );
  }
}