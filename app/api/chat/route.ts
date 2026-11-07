import { GoogleGenerativeAI } from '@google/generative-ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  let extractedMessages: { role: string; content: string }[] = [];
  try {
    const { messages, userContext, persona = "operator" } = await req.json();
    extractedMessages = messages;

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';
    if (!apiKey) throw new Error("API Key is missing in Vercel settings.");
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.8-flash' });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedMessages = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));
    
    // WelBuddy Persona Definition
    const personaGuidance = persona === "stoic"
      ? "ACTIVE PERSONA: Stoic Partner. Unapologetically direct, grounded in Marcus Aurelius and Seneca, zero fluff, high accountability, calm emotional composure."
      : persona === "compassionate"
      ? "ACTIVE PERSONA: Compassionate Anchor. Deeply attuned to nervous system exhaustion, psychological safety, gentle somatic interventions, anti-burnout reframing."
      : "ACTIVE PERSONA: High-Stakes Operator. Sharp executive velocity, 90-minute ultradian flow blocks, ruthlessly prioritizing the 20% that produces 80% business output while guarding sleep integrity.";

    const sysMsg = `SYSTEM INSTRUCTION: You are WelBuddy™, the world-class AI Assistant and Co-Pilot for the wellness of your user's mental and business life.
You bridge the gap between high-velocity business execution and nervous system sanctuary.
${personaGuidance}

CORE OPERATING PRINCIPLES:
1. DUAL-ENGINE HARMONY: Never sacrifice mental peace/circadian health for business output, nor encourage passive complacency when high-leverage business action is needed.
2. HYPER-TACTICAL & ACTIONABLE: Always provide concrete, timeboxed protocols (e.g. "Do this 2-minute physiological sigh now", "Next 90 minutes: close all tabs except your primary document").
3. FORMATTING MASTERY: Use clean Markdown with bold key actions, concise bullet points, and quick checkboxes [ ] when outlining tasks. Keep responses sharp, engaging, and high-density (avoid rambling boilerplate).
4. INTEGRATED TOOLS: Reference WelBuddy tools when appropriate (90m Flow Sprint, Vagus Voice, NSDR 2 PM Reboot, Eat The Frog Priority, Circadian Choreographer).`
      + (userContext ? `\n\nUSER PROFILE MEMORY (LONG-TERM METRICS): ${userContext}\nSeamlessly adapt your tone and protocols to this user's current goals, energy, and streak.` : "");
      
    formattedMessages.unshift({
      role: 'user',
      parts: [{ text: sysMsg }]
    });
    formattedMessages.unshift({
      role: 'model',
      parts: [{ text: "Understood. I am WelBuddy, the premier AI co-pilot for your mental and business life. Standing by." }]
    });

    const response = await model.generateContentStream({
      contents: formattedMessages
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response.stream) {
            const text = chunk.text();
            // Data Stream Protocol Format for Vercel AI SDK useChat
            controller.enqueue(encoder.encode(`0:${JSON.stringify(text)}\n`));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("AI API Error (likely quota reached):", error);
    
    // Import dynamically or just use the local function we created
    const { getFallbackResponse } = await import('@/lib/knowledgeDatabase');
    
    const lastMessage = extractedMessages.length > 0 ? extractedMessages[extractedMessages.length - 1].content : "";
    const fallbackText = await getFallbackResponse(lastMessage, error?.message || "");
    
    // Stream the fallback text to mimic the AI SDK format
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`0:${JSON.stringify(fallbackText)}\n`));
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  }
}
