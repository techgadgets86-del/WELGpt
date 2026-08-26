import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

export const maxDuration = 10;

export async function POST() {
  try {
    const { object } = await generateObject({
      model: google('gemini-3.6-flash'),
      schema: z.object({
        quote: z.string(),
        author: z.string(),
      }),
      prompt: `Generate a highly profound, completely original 1-sentence quote about neuroplasticity, stoicism, extreme focus, or human potential. Also create a futuristic, fictional author name (like "Dr. Elias Vance" or "Neuro-Architect Kael").`,
    });
    
    return Response.json(object);
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
