import { GoogleGenerativeAI } from '@google/generative-ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';
    if (!apiKey) throw new Error("API Key is missing.");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: "application/json" }
    });

        const sysPrompt = `
      You are an elite nutritionist AI. The user wants a list of exactly 4 hyper-specific food items or meals designed for: ${prompt}.
      
      You must respond ONLY with a valid JSON array. Do not include any markdown formatting like \`\`\`json or comments.
      Use exactly this schema for the JSON array of exactly 4 objects:
      [
        {
          "name": "Meal Name",
          "reason": "Scientific explanation of why this boosts HGH, bone density, or the specific goal",
          "ingredients": ["ingredient 1", "ingredient 2", "ingredient 3"],
          "searchPrompt": "a cinematic food photography shot of Meal Name, dark moody lighting" 
        }
      ]
    `;

    const result = await model.generateContent(sysPrompt);
    let text = result.response.text();
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const items = JSON.parse(text);

    return new Response(JSON.stringify({ items }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500 });
  }
}
