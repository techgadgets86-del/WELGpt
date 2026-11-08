import { NextResponse } from 'next/server';
import { adminDb, adminMessaging } from '@/lib/firebaseAdmin';
import type { Message } from 'firebase-admin/messaging';
import { setVapidDetails, sendNotification } from 'web-push';
import { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT } from '@/lib/vapidConfig';

setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      // In development or test, allow if no secret configured
      if (process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // 1. Generate Spicy WelBuddy message using OpenRouter
    const dynamicTitle = "WelBuddy AI • High-Leverage Check-in ⚡";
    let dynamicBody = "Protect your focus and crush your wellness protocol. Tap in!";
    
    try {
      if (process.env.OPENROUTER_API_KEY) {
        const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "meta-llama/llama-3.1-8b-instruct:free",
            messages: [
              { 
                role: "system", 
                content: "You are WelBuddy, the sharp AI assistant for the wellness of your user's mental and business life. Generate a very short (max 12 words), spicy, high-leverage push notification body urging the user to lock in their focus and protect their routine. Do not use quotes." 
              }
            ]
          })
        });
        
        const aiData = await aiResponse.json();
        if (aiData?.choices?.[0]?.message?.content) {
          dynamicBody = aiData.choices[0].message.content.trim().replace(/^["']|["']$/g, '');
        }
      }
    } catch (e) {
      console.error("OpenRouter fetch failed, using default message:", e);
    }

    // 2. Fetch Native FCM Users
    const usersSnapshot = await adminDb.collection('users')
      .where('fcmToken', '!=', null)
      .get();

    const messages: Message[] = [];
    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      const token = userData.fcmToken;
      if (token && typeof token === 'string') {
        messages.push({
          token: token,
          notification: {
            title: dynamicTitle,
            body: dynamicBody,
          },
          data: {
            route: "/coach",
          },
        });
      }
    });

    let fcmSent = 0;
    const chunkSize = 500;
    for (let i = 0; i < messages.length; i += chunkSize) {
      const chunk = messages.slice(i, i + chunkSize);
      const response = await adminMessaging.sendEach(chunk);
      fcmSent += response.successCount;
    }

    // 3. Fetch Web Push Subscriptions for Lock-Screen Pushes
    let webPushSent = 0;
    try {
      const webSubsSnapshot = await adminDb.collection('web_push_subscriptions')
        .where('active', '==', true)
        .limit(200)
        .get();

      const pushPayload = JSON.stringify({
        title: dynamicTitle,
        body: dynamicBody,
        icon: '/logo-icon.png',
        badge: '/logo-icon.png',
        url: '/coach?tab=tasks',
        tag: 'welbuddy-daily-nudge-' + Date.now(),
        timestamp: Date.now(),
      });

      const webPromises = webSubsSnapshot.docs.map(async (doc) => {
        const sub = doc.data().subscription;
        if (sub && sub.endpoint) {
          try {
            await sendNotification(sub, pushPayload, { TTL: 3600, urgency: 'high' });
            webPushSent++;
          } catch (err: any) {
            if (err.statusCode === 410 || err.statusCode === 404) {
              await doc.ref.update({ active: false });
            }
          }
        }
      });

      await Promise.all(webPromises);
    } catch (webErr) {
      console.warn('[Cron WebPush] Error broadcasting to web subscriptions:', webErr);
    }

    return NextResponse.json({ 
      success: true, 
      fcmSent,
      webPushSent,
      message: dynamicBody
    });

  } catch (error: unknown) {
    console.error('Error in cron job:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
