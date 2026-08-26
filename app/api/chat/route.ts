import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-3.6-flash'),
    messages,
    system: "You are WelGPT, a highly advanced AI neuroscience coach and wellness companion..."
  });

  return result.toDataStreamResponse();
}
