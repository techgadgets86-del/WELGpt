import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = await streamText({
      model: google('gemini-1.5-flash'),
      system: `You are WelGPT, a highly advanced AI neuroscience and wellness coach. 
      Your tone is calm, highly intelligent, slightly futuristic, and deeply empathetic.
      You specialize in dopamine detox, circadian rhythms, neuroplasticity, and meditation.
      Keep your responses concise but insightful. Do not use overly long paragraphs.`,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to generate response" }), { status: 500 });
  }
}
