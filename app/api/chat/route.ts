import { GoogleGenerativeAI } from '@google/generative-ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  let extractedMessages: { role: string; content: string }[] = [];
  try {
    const { messages, userContext } = await req.json();
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
    
    // Add system instruction as the very first message
    const sysMsg = "SYSTEM INSTRUCTION: You are WelGPT, a highly advanced AI habit and wellness coach. Keep responses concise, brilliant, and formatted cleanly with markdown." 
      + (userContext ? `\n\nUSER PROFILE DATA (LONG-TERM MEMORY): ${userContext} Use this data seamlessly in your responses to personalize their coaching experience.` : "");
      
    formattedMessages.unshift({
      role: 'user',
      parts: [{ text: sysMsg }]
    });
    formattedMessages.unshift({
      role: 'model',
      parts: [{ text: "Understood. I will act as WelGPT." }]
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
