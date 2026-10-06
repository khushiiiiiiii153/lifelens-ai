import { GoogleGenAI } from "@google/genai";

export async function POST(request) {
  try {
    const body = await request.json();

    const situation = String(
      body?.situation || body?.question || ""
    ).trim();

    const language = String(body?.language || "English");

    if (!situation) {
      return Response.json(
        { error: "Please enter your situation." },
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

Help the user with their everyday situation.

Situation:
${situation}

Language:
${language}

Use exactly these headings:

Problem
Understanding
Action Plan
Helpful Tip

Give 3 to 5 numbered practical steps under Action Plan.

Keep the answer simple, supportive and practical.
Do not use markdown tables.
Do not put * before headings.
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
    console.error("ANALYZE ERROR:", error);

    return Response.json(
      {
        error:
          error?.message ||
          "LifeLens AI could not process your request.",
      },
      { status: 500 }
    );
  }
}