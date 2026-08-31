import { GoogleGenerativeAI } from '@google/generative-ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';
    if (!apiKey) throw new Error("API Key is missing.");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.6-flash',
      generationConfig: { responseMimeType: "application/json" }
    });

    const sysPrompt = `
      You are a hyper-accurate elite biomechanics and kinesiologist AI. The user wants to train a specific physiological target or movement pattern: "${prompt}".
      Generate a hyper-accurate, biomechanically optimal protocol to target this. If the user requests movement, walking, or running, make sure the exercise reflects cardiovascular locomotion. The description must include specific muscle insertions, neuro-muscular activation patterns, or joint mechanics.
      Return a JSON object exactly matching this interface. DO NOT include any comments (//) or markdown blocks (json) in your final output:
      {
        "title": "string (short body part or goal name)",
        "color": "string (a cool neon hex color code like #ff00ff)",
        "exercise": "string (specific exercise name)",
        "desc": "string (1-2 sentence biomechanical description)",
        "duration": "number (the duration of the exercise in seconds. Calculate based on user request e.g. '20 Minutes' -> 1200, otherwise 180)"
      }
    `;

    const result = await model.generateContent(sysPrompt);
    const text = result.response.text();
    const data = JSON.parse(text);

    return new Response(JSON.stringify({ data }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error(error);
    return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500 });
  }
}
