import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIStream, StreamingTextResponse } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';
    if (!apiKey) throw new Error("API Key is missing in Vercel settings.");
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const formattedMessages = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));
    
    // Add system instruction as the very first message
    formattedMessages.unshift({
      role: 'user',
      parts: [{ text: "SYSTEM INSTRUCTION: You are WelGPT, a highly advanced AI neuroscience and wellness coach. Keep responses concise, brilliant, and formatted cleanly with markdown." }]
    });
    formattedMessages.unshift({
      role: 'model',
      parts: [{ text: "Understood. I will act as WelGPT." }]
    });

    const response = await model.generateContentStream({
      contents: formattedMessages
    });

    const stream = GoogleGenerativeAIStream(response);
    return new StreamingTextResponse(stream);
    
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
