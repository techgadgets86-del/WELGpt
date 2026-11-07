import { NextResponse } from 'next/server';
import { EventName } from '@paddle/paddle-node-sdk';
import { getPaddleServer } from '@/lib/paddle/server';
import {
  handleCustomerEvent,
  handleSubscriptionEvent,
  handleTransactionCompleted,
} from '@/lib/paddle/webhookHandlers';

// Force dynamic execution so Next.js doesn't attempt build-time prerendering
export const dynamic = 'force-dynamic';

/**
 * Paddle Webhook Endpoint with Signature Verification.
 * 
 * Rules:
 * 1. Signature is verified using the Paddle SDK before anything else.
 * 2. Raw request body (text) is passed directly to unmarshal - NOT parsed JSON.
 * 3. Uses the webhook signing secret (PADDLE_WEBHOOK_SECRET), NOT the API key.
 * 4. Verification failures return non-2xx so Paddle retries.
 * 5. Handlers are idempotent.
 * 6. Routes verified events to typed handlers; safely ignores other types.
 */
export async function POST(req: Request) {
  const signature = req.headers.get('paddle-signature');
  const secretKey = process.env.PADDLE_WEBHOOK_SECRET;

  // 1. Validate environment configuration
  if (!secretKey) {
    console.error('[Paddle Webhook] PADDLE_WEBHOOK_SECRET is not configured.');
    return NextResponse.json(
      { error: 'Webhook secret is not configured on the server.' },
      { status: 500 }
    );
  }

  // 2. Validate paddle-signature header presence
  if (!signature) {
    console.error('[Paddle Webhook] Missing paddle-signature header in incoming request.');
    return NextResponse.json(
      { error: 'Missing paddle-signature header.' },
      { status: 400 }
    );
  }

  // 3. Read RAW request body as text (do NOT parse JSON beforehand)
  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch (err) {
    console.error('[Paddle Webhook] Failed to read raw request body:', err);
    return NextResponse.json(
      { error: 'Unable to read request payload.' },
      { status: 400 }
    );
  }

  // 4. Verify signature using Paddle SDK unmarshal
  let eventData;
  try {
    const paddle = getPaddleServer();
    eventData = await paddle.webhooks.unmarshal(rawBody, secretKey, signature);
  } catch (err) {
    console.error('[Paddle Webhook] Signature verification failed:', err);
    // Non-2xx response tells Paddle the delivery failed so it will retry
    return NextResponse.json(
      { error: 'Invalid webhook signature.' },
      { status: 400 }
    );
  }

  // 5. Route verified events to typed handlers
  const eventType = eventData.eventType;
  console.log(`[Paddle Webhook] Verified event received: ${eventType} (ID: ${eventData.eventId || 'unknown'})`);

  try {
    switch (eventType) {
      case EventName.CustomerCreated:
      case EventName.CustomerUpdated:
        await handleCustomerEvent(eventData.data);
        break;

      case EventName.SubscriptionCreated:
      case EventName.SubscriptionUpdated:
      case EventName.SubscriptionCanceled:
      case EventName.SubscriptionActivated:
      case EventName.SubscriptionPastDue:
      case EventName.SubscriptionPaused:
      case EventName.SubscriptionResumed:
        await handleSubscriptionEvent(eventData.data);
        break;

      case EventName.TransactionCompleted:
        await handleTransactionCompleted(eventData.data);
        break;

      default:
        console.log(`[Paddle Webhook] Safely ignored unhandled event type: ${eventType}`);
        break;
    }

    // Acknowledge receipt to Paddle
    return NextResponse.json({ received: true, eventType }, { status: 200 });
  } catch (handlerError) {
    console.error(`[Paddle Webhook] Handler execution error for ${eventType}:`, handlerError);
    // Return 500 so Paddle will retry delivery for transient database/network errors
    return NextResponse.json(
      { error: 'Internal error processing webhook event.' },
      { status: 500 }
    );
  }
}
