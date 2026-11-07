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

  const apiKey = process.env.PADDLE_API_KEY;
  const env = process.env.NEXT_PUBLIC_PADDLE_ENV;

  if (!apiKey) {
    throw new Error(
      'PADDLE_API_KEY is not defined in environment variables. ' +
      'Please obtain your server API key from Paddle Dashboard > Developer Tools > Authentication.'
    );
  }

  if (!env || (env !== 'production' && env !== 'sandbox')) {
    throw new Error(
      `NEXT_PUBLIC_PADDLE_ENV is invalid or not defined: "${env}". Must be "production" or "sandbox".`
    );
  }

  paddleServerInstance = new Paddle(apiKey, {
    environment: env === 'production' ? Environment.production : Environment.sandbox,
  });

  return paddleServerInstance;
}
