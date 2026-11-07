import { initializePaddle, Paddle } from "@paddle/paddle-js";

let paddleInstancePromise: Promise<Paddle | undefined> | null = null;

/**
 * Initializes and retrieves the singleton client-side Paddle instance.
 * Fails loudly if environment variables are missing or misconfigured.
 */
export function getPaddle(): Promise<Paddle | undefined> {
  if (typeof window === "undefined") {
    return Promise.resolve(undefined);
  }

  if (paddleInstancePromise) {
    return paddleInstancePromise;
  }

  const env = process.env.NEXT_PUBLIC_PADDLE_ENV;
  if (!env) {
    throw new Error(
      "Paddle configuration error: NEXT_PUBLIC_PADDLE_ENV is not set. Set it to 'production' or 'sandbox'."
    );
  }

  if (env !== "production" && env !== "sandbox") {
    throw new Error(
      `Paddle configuration error: Invalid NEXT_PUBLIC_PADDLE_ENV '${env}'. Must be either 'production' or 'sandbox'.`
    );
  }

  const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
  if (!token) {
    throw new Error(
      "Paddle configuration error: NEXT_PUBLIC_PADDLE_CLIENT_TOKEN is not set. Provide your client-side token in .env.local."
    );
  }

  if (env === "production" && !token.startsWith("live_")) {
    throw new Error(
      "Paddle configuration error: In production environment, NEXT_PUBLIC_PADDLE_CLIENT_TOKEN must start with 'live_'."
    );
  }

  if (env === "sandbox" && !token.startsWith("test_")) {
    throw new Error(
      "Paddle configuration error: In sandbox environment, NEXT_PUBLIC_PADDLE_CLIENT_TOKEN must start with 'test_'."
    );
  }

  paddleInstancePromise = initializePaddle({
    environment: env,
    token: token,
  });

  return paddleInstancePromise;
}
