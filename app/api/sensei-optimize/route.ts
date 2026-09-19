import { generateWithFallbacks } from '@/lib/aiFallbackEngine';

export const maxDuration = 20;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { age, weight, height, goal } = body;

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

    const text = await generateWithFallbacks(prompt);
    return new Response(text, { headers: { "Content-Type": "application/json" } });
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("AI Generation failed across all APIs:", error);
    // Hard fallback so the UI doesn't completely break
    return new Response(JSON.stringify({
      core: { title: "Core Matrix", description: "Standard stabilization.", diagram: "[XXX--]", exercise: "Plank", duration: 60 },
      arms: { title: "Upper Kinetix", description: "Standard pressing.", diagram: "[XXXX-]", exercise: "Pushups", duration: 60 },
      legs: { title: "Lower Dynamics", description: "Standard squat.", diagram: "[XXXXX]", exercise: "Air Squats", duration: 60 }
    }), { headers: { "Content-Type": "application/json" } });
  }
}
