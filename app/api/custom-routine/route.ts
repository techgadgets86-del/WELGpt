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
      You are an elite AI neuroscience coach. Generate a highly personalized daily routine (4-6 tasks) based on the user's specific goals.
      Return ONLY a JSON array of task objects matching this schema:
      [{ "id": "c1", "time": "08:00 AM", "title": "...", "desc": "..." }]
      Make it scientific and practical.
      
      User Goal: ${prompt}
    `;

    const result = await model.generateContent(sysPrompt);
    const text = result.response.text();
    const tasks = JSON.parse(text);

    return new Response(JSON.stringify({ tasks }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error(error);
    return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500 });
  }
}
