import { GoogleGenerativeAI } from '@google/generative-ai';

export const maxDuration = 20;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { age, weight, height, goal } = body;

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';
    if (!apiKey) throw new Error("API Key is missing.");
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-3.6-flash',
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `You are an elite AI personal trainer.
Given the user's profile: Age ${age}, Weight ${weight}, Height ${height}, Goal: ${goal}.
Create 3 highly specific, unique, and optimal bodyweight/calisthenics exercises for them.

Return ONLY a JSON object EXACTLY matching this structure, with no markdown formatting:
{
  "core": {
    "title": "Core Matrix",
    "description": "Scientific description of why this is perfect for their age/weight/goal.",
    "diagram": "A cool text representation like [XXXX---]",
    "exercise": "Name of Exercise (e.g. L-Sit Progression)",
    "duration": 180
  },
  "arms": {
    "title": "Upper Kinetix",
    "description": "...",
    "diagram": "...",
    "exercise": "...",
    "duration": 300
  },
  "legs": {
    "title": "Lower Dynamics",
    "description": "...",
    "diagram": "...",
    "exercise": "...",
    "duration": 240
  }
}`;

    const response = await model.generateContent(prompt);
    const text = response.response.text();
    
    return new Response(text, { headers: { "Content-Type": "application/json" } });
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
