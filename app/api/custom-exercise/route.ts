import { generateWithFallbacks } from '@/lib/aiFallbackEngine';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const sysPrompt = `
      You are a hyper-accurate elite biomechanics and kinesiologist AI. The user wants to train a specific physiological target or movement pattern: "${prompt}".
      Generate a hyper-accurate, biomechanically optimal protocol to target this. If the user requests movement, walking, or running, make sure the exercise reflects cardiovascular locomotion.
      
      You must respond ONLY with a valid JSON object. Do not include any markdown formatting like \`\`\`json or comments.
      Use exactly this schema for the JSON object:
      {
        "title": "Short body part or goal name (string)",
        "color": "Neon hex color code like #ff00ff (string)",
        "exercise": "Specific exercise name (string)",
        "desc": "1-2 sentence biomechanical description (string)",
        "duration": 1200
      }
      
      Provide the actual values for the keys, not the descriptions. Ensure duration is an integer (number of seconds). E.g. 20 minutes = 1200. Default is 180 if unspecified.
    `;

    const text = await generateWithFallbacks(sysPrompt);
    const data = JSON.parse(text);

    return new Response(JSON.stringify({ data }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error("AI Generation failed across all APIs:", error);
    // Hard fallback so the UI doesn't completely break
    return new Response(JSON.stringify({ 
      data: {
        title: "Optimized Recovery",
        color: "#14b8a6",
        exercise: "Active Decompression",
        desc: "A generalized sequence to reduce systemic stress when the network is overloaded.",
        duration: 300
      }
    }), { headers: { 'Content-Type': 'application/json' } });
  }
}
