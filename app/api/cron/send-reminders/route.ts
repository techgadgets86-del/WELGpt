import { NextResponse } from 'next/server';
import { adminDb, adminMessaging } from '@/lib/firebaseAdmin';

// Vercel Cron Jobs send a Bearer token we can verify, or we can just protect it with a secret.
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

    // 2. Prepare Notification Payloads
    const messages: any[] = [];
    
    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      const token = userData.fcmToken;

      if (token) {
        messages.push({
          token: token,
          notification: {
            title: "Time for your Daily Detox 🌿",
            body: "Your AI Coach has updated your routine. Tap to continue your streak!",
          },
          data: {
            route: "/dashboard",
          },
        });
      }
    });

    // 3. Send Notifications autonomously in batches of 500 (Firebase Multicast limit)
    let successCount = 0;
    let failureCount = 0;

    // Split messages into chunks of 500
    const chunkSize = 500;
    for (let i = 0; i < messages.length; i += chunkSize) {
      const chunk = messages.slice(i, i + chunkSize);
      
      // We use sendEach() to send multiple messages
      const response = await adminMessaging.sendEach(chunk);
      successCount += response.successCount;
      failureCount += response.failureCount;

      // Handle failures (e.g., token expired/invalid)
      if (response.failureCount > 0) {
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            console.error(`Failed to send to token: ${chunk[idx].token}`, resp.error);
            // Optional: If error is 'messaging/invalid-registration-token' or 'messaging/registration-token-not-registered',
            // you might want to delete the token from the user's document here to clean up.
          }
        });
      }
    }

    return NextResponse.json({ 
      success: true, 
      sent: successCount, 
      failed: failureCount 
    });

  } catch (error: any) {
    console.error('Error in cron job:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
