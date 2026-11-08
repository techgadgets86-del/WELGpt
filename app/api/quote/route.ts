import { generateWithFallbacks } from '@/lib/aiFallbackEngine';

export const maxDuration = 10;

export async function POST() {
  try {
    const prompt = `Generate a highly profound, completely original 1-sentence quote about neuroplasticity, stoicism, extreme focus, or human potential. Also create a futuristic, fictional author name (like "Dr. Elias Vance" or "Neuro-Architect Kael").
    You must respond ONLY with a valid JSON object. Do not include any markdown formatting like \`\`\`json or comments.
    Use exactly this schema for the JSON object:
    {
      "quote": "The quote text here",
      "author": "Author Name"
    }`;

    const text = await generateWithFallbacks(prompt);
    
    return new Response(text, {
      headers: { "Content-Type": "application/json" }
    });
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("AI Generation failed across all APIs:", error);
    // Fallback static quote
    return new Response(JSON.stringify({ 
      quote: "The limits of our biology are simply the starting line of our discipline.", 
      author: "Architect Vance" 
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  }
}
