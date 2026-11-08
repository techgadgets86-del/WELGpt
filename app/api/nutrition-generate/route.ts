import { getFallbackDiets } from '@/lib/nutritionFallbackDb';
import { generateWithFallbacks } from '@/lib/aiFallbackEngine';

export const maxDuration = 30;

export async function POST(req: Request) {
  let prompt = "";
  try {
    const body = await req.json();
    prompt = body.prompt || "";

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

    const text = await generateWithFallbacks(sysPrompt);
    const items = JSON.parse(text);

    return new Response(JSON.stringify({ items }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("AI Generation failed across all APIs, falling back to static DB 1000+ Combinations", error);
    // Fallback to our combinatorial database if ALL API limits are reached
    const fallbackItems = getFallbackDiets(prompt);
    
    return new Response(JSON.stringify({ items: fallbackItems }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
