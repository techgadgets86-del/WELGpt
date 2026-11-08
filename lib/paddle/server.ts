import { Paddle, Environment } from '@paddle/paddle-node-sdk';

/**
 * Singleton server-side Paddle SDK client.
 * Never exposes API key or server SDK to client components.
 * Fails loudly if environment variables are missing or misconfigured.
 */
let paddleServerInstance: Paddle | null = null;

export function getPaddleServer(): Paddle {
  if (paddleServerInstance) {
    return paddleServerInstance;
  }

  const apiKey = process.env.PADDLE_API_KEY || '';
  const env = process.env.NEXT_PUBLIC_PADDLE_ENV || 'production';

  paddleServerInstance = new Paddle(apiKey, {
    environment: env === 'production' ? Environment.production : Environment.sandbox,
  });

  return paddleServerInstance;
}
