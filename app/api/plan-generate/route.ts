import { GoogleGenerativeAI } from '@google/generative-ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';
    if (!apiKey) throw new Error("API Key is missing.");
    
    const body = await req.json();
    const { action, goals, feeling, dayType, previousPlan } = body;
    // action can be 'create_new' or 'adjust_daily'

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-3.8-flash',
      generationConfig: { responseMimeType: "application/json" }
    });

    let prompt = "";

    if (action === "create_new") {
      prompt = `You are an elite AI wellness coach. Generate a completely fresh, highly optimized daily routine for a user.
User Context:
Goals: ${goals?.join(", ")}
Current Feeling: ${feeling || 'Okay'}
Biggest Obstacle: ${body.obstacle || 'Time'}
Time Commitment: ${body.timeCommitment || '15-30 mins'}
Day Type: ${dayType || 'Flexible'}
Fitness Level: ${body.fitnessLevel || 'Beginner'}

You must respond ONLY with a valid JSON object. Do not include markdown formatting.
Schema:
{
  "coachMessage": "A short, extremely compelling sentence welcoming them and explaining how this plan addresses their specific feeling and goals.",
  "plan": {
    "morning": [ { "id": "m1", "time": "Morning", "title": "Name of Habit", "desc": "Scientific description", "completed": false } ],
    "afternoon": [ { "id": "a1", "time": "Afternoon", "title": "Name of Habit", "desc": "Scientific description", "completed": false } ],
    "evening": [ { "id": "e1", "time": "Evening", "title": "Name of Habit", "desc": "Scientific description", "completed": false } ]
  }
}
Limit to 2-3 tasks per time block maximum. Focus heavily on their stated goals.`;
    } else {
      // adjust_daily
      const previousStr = JSON.stringify(previousPlan);
      prompt = `You are an elite AI wellness coach managing a user's daily workflow. The user is starting a new day. 
Review their previous day's plan and completion status:
${previousStr}

Goals: ${goals?.join(", ")}

Generate a NEW plan for today, adjusting based on what they missed or succeeded at yesterday.
If they missed evening tasks, maybe move them earlier. If they crushed it, maybe advance the difficulty slightly.

You must respond ONLY with a valid JSON object. Do not include markdown formatting.
Schema:
{
  "coachMessage": "A powerful, personalized 1-2 sentence message. Example: 'You completed 3 of 4 goals yesterday. I noticed movement has been harder for you to complete in the evening, so I've moved tomorrow's session to 6 PM.'",
  "plan": {
    "morning": [ { "id": "m1", "time": "Morning", "title": "Name of Habit", "desc": "Scientific description", "completed": false } ],
    "afternoon": [ { "id": "a1", "time": "Afternoon", "title": "Name of Habit", "desc": "Scientific description", "completed": false } ],
    "evening": [ { "id": "e1", "time": "Evening", "title": "Name of Habit", "desc": "Scientific description", "completed": false } ]
  }
}
Keep tasks extremely relevant. Limit to 2-3 tasks per block.`;
    }

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
