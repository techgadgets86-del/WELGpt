import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || '',
});

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = await streamText({
      model: google('gemini-pro'),
      system: `You are WelGPT, a highly advanced AI neuroscience and wellness coach. 
      Your tone is calm, highly intelligent, slightly futuristic, and deeply empathetic.
      You specialize in dopamine detox, circadian rhythms, neuroplasticity, and meditation.
      Keep your responses concise but insightful. Do not use overly long paragraphs.`,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message || "Failed to generate response" }), { status: 500 });
  }
}
