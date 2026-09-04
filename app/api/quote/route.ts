import { GoogleGenerativeAI } from '@google/generative-ai';

export const maxDuration = 10;

export async function POST() {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';
    if (!apiKey) throw new Error("API Key is missing in Vercel settings.");
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `Generate a highly profound, completely original 1-sentence quote about neuroplasticity, stoicism, extreme focus, or human potential. Also create a futuristic, fictional author name (like "Dr. Elias Vance" or "Neuro-Architect Kael").
    You must respond ONLY with a valid JSON object. Do not include any markdown formatting like \`\`\`json or comments.
    Use exactly this schema for the JSON object:
    {
      "quote": "The quote text here",
      "author": "Author Name"
    }`;

    const response = await model.generateContent(prompt);
    let text = response.response.text();
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return new Response(text, {
      headers: { "Content-Type": "application/json" }
    });
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
