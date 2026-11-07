import { NextResponse } from 'next/server';
import { adminDb, adminMessaging } from '@/lib/firebaseAdmin';
import type { Message } from 'firebase-admin/messaging';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Fetch users who have an fcmToken
    const usersSnapshot = await adminDb.collection('users')
      .where('fcmToken', '!=', null)
      .get();

    if (usersSnapshot.empty) {
      return NextResponse.json({ message: 'No users with FCM tokens found.' });
    }

    // 2. Generate a Spicy Notification using OpenRouter (The "Thinking Orbs" logic)
    const dynamicTitle = "Your Thinking Orb Speaks 🔮";
    let dynamicBody = "Time to realign your posture and crush your goals. Tap in!";
    
    try {
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
    } catch (e) {
      console.error("OpenRouter fetch failed, falling back to default message", e);
    }

    // 3. Prepare Notification Payloads
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
            route: "/dashboard",
          },
        });
      }
    });

    // 4. Send Notifications autonomously in batches of 500 (Firebase Multicast limit)
    let successCount = 0;
    let failureCount = 0;

    const chunkSize = 500;
    for (let i = 0; i < messages.length; i += chunkSize) {
      const chunk = messages.slice(i, i + chunkSize);
      
      const response = await adminMessaging.sendEach(chunk);
      successCount += response.successCount;
      failureCount += response.failureCount;

      if (response.failureCount > 0) {
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            const failedToken = (chunk[idx] as { token?: string })?.token || 'unknown';
            console.error(`Failed to send to token: ${failedToken}`, resp.error);
          }
        });
      }
    }

    return NextResponse.json({ 
      success: true, 
      sent: successCount, 
      failed: failureCount,
      generatedMessage: dynamicBody
    });

  } catch (error: unknown) {
    console.error('Error in cron job:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
