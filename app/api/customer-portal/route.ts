import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebaseAdmin';
import { getPaddleServer } from '@/lib/paddle/server';
import { findCustomerByUser, getSubscriptionsForCustomer } from '@/lib/paddle/db';

export const dynamic = 'force-dynamic';

/**
 * POST /api/customer-portal
 * 
 * Securely mints a Paddle Customer Portal session for the authenticated user.
 * 
 * Rules:
 * - Verifies user authentication first via Firebase ID token.
 * - Resolves customer ID strictly server-side from the verified user session.
 * - Never trusts any customer ID passed by the client.
 * - Looks up customer and subscriptions from mirrored database tables.
 * - Mints portal session using Paddle SDK and returns portal URL.
 */
export async function POST(req: Request) {
  try {
    // 1. Authenticate user from Bearer ID Token
    const authHeader = req.headers.get('authorization') || '';
    if (!authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized: Missing or malformed authorization header.' },
        { status: 401 }
      );
    }

    const idToken = authHeader.replace(/^Bearer\s+/, '').trim();
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch (authErr) {
      console.error('[Customer Portal] Token verification failed:', authErr);
      return NextResponse.json(
        { error: 'Unauthorized: Invalid or expired authentication token.' },
        { status: 401 }
      );
    }

    const userId = decodedToken.uid;
    const userEmail = decodedToken.email;

    // 2. Resolve Paddle Customer ID server-side from database
    const customer = await findCustomerByUser(userId, userEmail);

    if (!customer || !customer.customer_id) {
      return NextResponse.json(
        {
          error: 'No active billing account found. Please subscribe to a plan first.',
          noCustomer: true,
        },
        { status: 404 }
      );
    }

    // 3. Resolve customer's subscriptions from mirrored database
    const subscriptions = await getSubscriptionsForCustomer(customer.customer_id);
    const subscriptionIds = subscriptions.map((s) => s.subscription_id);

    // 4. Mint Paddle Customer Portal Session
    const paddle = getPaddleServer();
    const portalSession = await paddle.customerPortalSessions.create(
      customer.customer_id,
      subscriptionIds
    );

    const portalUrl = portalSession.urls?.general?.overview;
    if (!portalUrl) {
      throw new Error('Paddle did not return a valid customer portal URL.');
    }

    return NextResponse.json({
      url: portalUrl,
      customerId: customer.customer_id,
      activeSubscriptionsCount: subscriptionIds.length,
    });
  } catch (error) {
    console.error('[Customer Portal] Failed to generate portal session:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
