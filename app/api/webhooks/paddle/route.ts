import { NextResponse } from 'next/server';
import { Paddle, Environment, EventName } from '@paddle/paddle-node-sdk';
import { adminDb } from '@/lib/firebaseAdmin';

const paddle = new Paddle(process.env.PADDLE_API_KEY || 'dummy_key', {
  environment: process.env.NEXT_PUBLIC_PADDLE_ENV === 'production' ? Environment.production : Environment.sandbox
});

export async function POST(req: Request) {
  try {
    const signature = req.headers.get('paddle-signature') || '';
    const rawBody = await req.text();
    const secretKey = process.env.PADDLE_WEBHOOK_SECRET || '';

    if (!secretKey) {
      console.warn("PADDLE_WEBHOOK_SECRET is not set.");
    }

    let eventData;
    try {
      eventData = await paddle.webhooks.unmarshal(rawBody, secretKey, signature);
    } catch (e) {
      console.error('Webhook signature verification failed:', e);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Process the event
    console.log(`Received Paddle webhook: ${eventData.eventType}`);

    if (
      eventData.eventType === EventName.TransactionCompleted ||
      eventData.eventType === EventName.SubscriptionCreated ||
      eventData.eventType === EventName.SubscriptionActivated
    ) {
      // @ts-ignore - The SDK types eventData.data based on eventType
      const customerId = eventData.data.customerId;
      
      if (customerId) {
        // Fetch customer from Paddle to get the exact email
        const customer = await paddle.customers.get(customerId);
        
        if (customer && customer.email) {
          console.log(`Upgrading user ${customer.email} based on ${eventData.eventType}...`);
          
          const usersRef = adminDb.collection('users');
          const snapshot = await usersRef.where('email', '==', customer.email).get();
          
          if (!snapshot.empty) {
            // Update all matching docs (usually just one)
            for (const doc of snapshot.docs) {
              await doc.ref.update({
                isPremium: true,
                aiPlanTokens: 999,
                aiChatTokens: 9999
              });
            }
            console.log(`Successfully upgraded user ${customer.email} to Premium.`);
          } else {
            console.warn(`User with email ${customer.email} not found in Firebase. They might have used a different checkout email.`);
          }
        }
      }
    }

    // Acknowledge the webhook quickly to prevent timeouts and retries
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('Webhook processing error:', error);
    // Vercel / Next API routes need to return a response
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
