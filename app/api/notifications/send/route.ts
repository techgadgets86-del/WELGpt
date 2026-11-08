import { NextResponse } from 'next/server';
import { setVapidDetails, sendNotification } from 'web-push';
import { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT } from '@/lib/vapidConfig';
import { adminDb, adminMessaging } from '@/lib/firebaseAdmin';

setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, subscription, title, message, url, tag, channel } = body;

    const payload = JSON.stringify({
      title: title || 'WelBuddy AI • Daily Protocol',
      body: message || 'Time to check in with your routine.',
      icon: '/logo-icon.png',
      badge: '/logo-icon.png',
      tag: tag || 'welbuddy-' + (channel || 'general') + '-' + Date.now(),
      url: url || '/coach',
      timestamp: Date.now(),
    });

    // 1. Direct subscription push
    if (subscription && subscription.endpoint) {
      try {
        await sendNotification(subscription, payload, {
          TTL: 3600,
          urgency: 'high',
        });
        return NextResponse.json({ success: true, count: 1 });
      } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
      }
    }

    // 2. User ID push (query Firestore for user's subscriptions and fcmToken)
    if (userId) {
      let webPushCount = 0;
      let fcmCount = 0;

      // Web push subscriptions
      try {
        const subsSnap = await adminDb
          .collection('users')
          .doc(userId)
          .collection('push_subscriptions')
          .where('active', '==', true)
          .get();

        const pushPromises = subsSnap.docs.map(async (doc) => {
          const subData = doc.data().subscription;
          if (subData && subData.endpoint) {
            try {
              await sendNotification(subData, payload, { TTL: 3600, urgency: 'high' });
              webPushCount++;
            } catch (err: any) {
              if (err.statusCode === 410 || err.statusCode === 404) {
                await doc.ref.update({ active: false });
              }
            }
          }
        });
        await Promise.all(pushPromises);
      } catch (e) {
        console.warn('[WebPush] Error fetching user push subscriptions:', e);
      }

      // Native FCM token
      try {
        const userDoc = await adminDb.collection('users').doc(userId).get();
        const fcmToken = userDoc.data()?.fcmToken;
        if (fcmToken) {
          await adminMessaging.send({
            token: fcmToken,
            notification: {
              title: title || 'WelBuddy AI Alert',
              body: message || 'Protocol reminder.',
            },
            data: { route: url || '/coach' },
          });
          fcmCount++;
        }
      } catch (e) {
        console.warn('[FCM] Error sending to user FCM token:', e);
      }

      return NextResponse.json({
        success: true,
        sentWebPush: webPushCount,
        sentFcm: fcmCount,
      });
    }

    return NextResponse.json({ error: 'Provide either subscription or userId' }, { status: 400 });
  } catch (err: unknown) {
    console.error('[Notifications Send Error]', err);
    const msg = err instanceof Error ? err.message : 'Send error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
