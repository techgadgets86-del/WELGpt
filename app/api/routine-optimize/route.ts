import { GoogleGenerativeAI } from '@google/generative-ai';

export const maxDuration = 20;

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';
    if (!apiKey) throw new Error("API Key is missing.");
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `You are an elite AI neuroscience coach. Generate a completely fresh, highly optimized daily routine for maximum human potential and mental clarity.

You must respond ONLY with a valid JSON object. Do not include any markdown formatting like \`\`\`json or comments.
Use exactly this schema for the JSON object:
{
  "morning": [
    { "id": "m1", "time": "06:00 AM", "title": "Name of Habit", "desc": "Scientific description" },
    { "id": "m2", "time": "07:00 AM", "title": "Name of Habit", "desc": "Scientific description" },
    { "id": "m3", "time": "08:30 AM", "title": "Name of Habit", "desc": "Scientific description" },
    { "id": "m4", "time": "09:00 AM", "title": "Name of Habit", "desc": "Scientific description" }
  ],
  "evening": [
    { "id": "e1", "time": "07:00 PM", "title": "Name of Habit", "desc": "Scientific description" },
    { "id": "e2", "time": "08:00 PM", "title": "Name of Habit", "desc": "Scientific description" },
    { "id": "e3", "time": "09:00 PM", "title": "Name of Habit", "desc": "Scientific description" },
    { "id": "e4", "time": "09:30 PM", "title": "Name of Habit", "desc": "Scientific description" }
  ]
}`;

    const response = await model.generateContent(prompt);
    let text = response.response.text();
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return new Response(text, { headers: { "Content-Type": "application/json" } });
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
