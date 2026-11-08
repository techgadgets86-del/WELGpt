import { NextResponse } from 'next/server';
import { setVapidDetails, sendNotification } from 'web-push';
import { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT } from '@/lib/vapidConfig';

// Initialize web-push details
setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { subscription, delaySeconds = 0, title, message, url } = body;

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: 'Missing push subscription object' },
        { status: 400 }
      );
    }

    const delayMs = Math.min(10000, Math.max(0, Number(delaySeconds) * 1000));

    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    const payload = JSON.stringify({
      title: title || 'WelBuddy AI • Lock Screen Verification 🔒',
      body: message || 'Your phone received this notification while locked! WelBuddy background notifications are fully active.',
      icon: '/logo-icon.png',
      badge: '/logo-icon.png',
      tag: 'welbuddy-lockscreen-test-' + Date.now(),
      url: url || '/coach?tab=tasks',
      timestamp: Date.now(),
    });

    try {
      await sendNotification(subscription, payload, {
        TTL: 60, // Time to live in seconds
        urgency: 'high', // High urgency for immediate lock screen wake
      });

      return NextResponse.json({
        success: true,
        message: 'Push notification delivered to device',
        delayedSeconds: delayMs / 1000,
      });
    } catch (pushErr: any) {
      console.error('[WebPush Test Error]', pushErr);
      if (pushErr.statusCode === 410 || pushErr.statusCode === 404) {
        return NextResponse.json(
          { error: 'Subscription expired or unregistered', code: 'EXPIRED' },
          { status: 410 }
        );
      }
      return NextResponse.json(
        { error: pushErr.message || 'Push service rejected notification' },
        { status: 500 }
      );
    }
  } catch (err: unknown) {
    console.error('[Notification Test Endpoint Error]', err);
    const msg = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
