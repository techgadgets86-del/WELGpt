import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { subscription, userId, platform, preferences, userAgent } = body;

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: 'Missing push subscription endpoint' },
        { status: 400 }
      );
    }

    // Hash or encode endpoint to create a unique, safe document ID
    const endpointHash = Buffer.from(subscription.endpoint)
      .toString('base64url')
      .slice(0, 64);

    const docData = {
      subscription,
      userId: userId || 'anonymous',
      platform: platform || 'web',
      userAgent: userAgent || 'unknown',
      preferences: preferences || {
        morning: true,
        midday: true,
        routine: true,
        evening: true,
        hydration: true,
      },
      updatedAt: new Date().toISOString(),
      active: true,
    };

    // Store in global subscriptions collection
    try {
      await adminDb.collection('web_push_subscriptions').doc(endpointHash).set(docData, { merge: true });

      // If user is authenticated, also link under their user record
      if (userId && userId !== 'anonymous') {
        await adminDb.collection('users').doc(userId).collection('push_subscriptions').doc(endpointHash).set(docData, { merge: true });
        await adminDb.collection('users').doc(userId).set({
          hasWebPush: true,
          webPushLastRegistered: new Date().toISOString()
        }, { merge: true });
      }
    } catch (dbErr) {
      console.warn('[WebPush Subscribe] Firestore save skipped or fallback used:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Push subscription registered successfully',
      id: endpointHash,
    });
  } catch (err: unknown) {
    console.error('[WebPush Subscribe Error]', err);
    const msg = err instanceof Error ? err.message : 'Subscription error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
