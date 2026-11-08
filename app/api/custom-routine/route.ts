import { generateWithFallbacks } from '@/lib/aiFallbackEngine';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

        const sysPrompt = `
      You are a hyper-intelligent AI combining elite behavioral science, biomechanics, and chronobiology. Generate a highly accurate and physiologically precise daily routine (4-6 tasks) based on the user's specific performance and behavioral goals.
      
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

    const text = await generateWithFallbacks(sysPrompt);
    const tasks = JSON.parse(text);

    return new Response(JSON.stringify({ tasks }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error("AI Generation failed across all APIs:", error);
    // Hard fallback so the UI doesn't completely break
    return new Response(JSON.stringify({ 
      tasks: [
        {
          id: "cb1",
          time: "08:00 AM",
          title: "System Calibration",
          desc: "Hydrate with 16oz of water and perform a 5-minute movement sequence to reset the nervous system."
        },
        {
          id: "cb2",
          time: "08:00 PM",
          title: "Circadian Wind-Down",
          desc: "Decrease blue light exposure to naturally upregulate endogenous melatonin production."
        }
      ]
    }), { headers: { 'Content-Type': 'application/json' } });
  }
}
