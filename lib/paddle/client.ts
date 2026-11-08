import { initializePaddle, Paddle } from "@paddle/paddle-js";

let paddleInstancePromise: Promise<Paddle | undefined> | null = null;

const DEFAULT_PADDLE_ENV = "production";
const DEFAULT_CLIENT_TOKEN = "live_9e5498227f938187ba10cb6586d";

/**
 * Initializes and retrieves the singleton client-side Paddle instance.
 * Gracefully initializes and never crashes the React render tree.
 */
export async function getPaddle(): Promise<Paddle | undefined> {
  if (typeof window === "undefined") {
    return undefined;
  }

  if (paddleInstancePromise) {
    return paddleInstancePromise;
  }

  try {
    const env = (process.env.NEXT_PUBLIC_PADDLE_ENV as "production" | "sandbox") || DEFAULT_PADDLE_ENV;
    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || DEFAULT_CLIENT_TOKEN;

    paddleInstancePromise = initializePaddle({
      environment: env === "sandbox" ? "sandbox" : "production",
      token: token,
    });

    return await paddleInstancePromise;
  } catch (e) {
    console.warn("[Paddle] Client initialization fallback/skipped:", e);
    return undefined;
  }
}
