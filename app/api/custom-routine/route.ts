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
      You are a hyper-intelligent AI combining elite neuroscience, biomechanics, and chronobiology. Generate a highly accurate and physiologically precise daily routine (4-6 tasks) based on the user's specific physiological and psychological goals.
      
      You must respond ONLY with a valid JSON array. Do not include any markdown formatting like \`\`\`json or comments.
      Use exactly this schema for the JSON array:
      [
        {
          "id": "c1",
          "time": "08:00 AM",
          "title": "Short title",
          "desc": "Detailed neurochemical/biomechanical rationale"
        }
      ]
      
      User Goal: ${prompt}
    `;

    const result = await model.generateContent(sysPrompt);
    let text = result.response.text();
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const tasks = JSON.parse(text);

    return new Response(JSON.stringify({ tasks }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error(error);
    return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500 });
  }
}
