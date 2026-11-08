// ==============================================================================
// WelGPT / WelBuddy Advanced Service Worker (Lock-Screen & Background Push Engine)
// ==============================================================================

const CACHE_NAME = 'welbuddy-sw-v1';

// 1. Install Event: Skip waiting to activate immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// 2. Activate Event: Claim all clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    clients.claim().then(() => {
      console.log('[WelBuddy SW] Active and controlling clients');
    })
  );
});

// 3. Push Event: Triggers when the phone is locked or app is closed
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { body: event.data.text() };
    }
  }

  const title = data.title || 'WelBuddy AI • Health & Business Co-Pilot ⚡';
  const body = data.body || 'Your daily protocol is ready. Tap to align your nervous system and business focus.';
  const url = data.url || '/coach?tab=tasks';
  const tag = data.tag || 'welbuddy-alert-' + Date.now();

  const options = {
    body: body,
    icon: data.icon || '/logo-icon.png',
    badge: data.badge || '/logo-icon.png',
    image: data.image || undefined,
    tag: tag,
    renotify: true,
    requireInteraction: true, // Crucial: Keeps notification persistent on lock screen
    silent: false,
    vibrate: [250, 100, 250, 100, 250],
    data: {
      url: url,
      timestamp: Date.now(),
      ...data
    },
    actions: [
      { action: 'open_routine', title: 'Open Routine ⚡' },
      { action: 'open_tasks', title: 'View Tasks 📋' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// 4. Notification Click Event: Wakes up phone and opens the app to the right destination
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  let targetUrl = event.notification.data?.url || '/coach';
  if (event.action === 'open_routine') {
    targetUrl = '/routine';
  } else if (event.action === 'open_tasks') {
    targetUrl = '/coach?tab=tasks';
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, navigate and focus it
      for (const client of clientList) {
        if ('focus' in client) {
          if ('navigate' in client) {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// 5. Message Event: Handles test countdowns and local background scheduling
self.addEventListener('message', (event) => {
  const { data } = event;
  if (!data || !data.type) return;

  if (data.type === 'SCHEDULE_LOCKSCREEN_NOTIFICATION') {
    const delayMs = Math.max(1000, Number(data.delayMs) || 5000);
    const title = data.title || 'WelBuddy AI • Lock Screen Verification 🔒';
    const body = data.body || 'Success! WelBuddy delivers notifications even when your phone is locked.';
    const url = data.url || '/coach?tab=tasks';

    // Keep service worker alive in background until the timer completes
    const schedulePromise = new Promise((resolve) => {
      setTimeout(async () => {
        try {
          await self.registration.showNotification(title, {
            body: body,
            icon: '/logo-icon.png',
            badge: '/logo-icon.png',
            tag: 'welbuddy-lockscreen-test',
            renotify: true,
            requireInteraction: true,
            vibrate: [300, 150, 300, 150, 300],
            data: { url: url },
            actions: [
              { action: 'open_tasks', title: 'Open WelBuddy ⚡' },
              { action: 'dismiss', title: 'Dismiss' }
            ]
          });
        } catch (err) {
          console.error('[WelBuddy SW] Failed to show scheduled notification:', err);
        }
        resolve(null);
      }, delayMs);
    });

    event.waitUntil(schedulePromise);
  } else if (data.type === 'SHOW_NOTIFICATION_NOW') {
    const title = data.title || 'WelBuddy AI Alert ⚡';
    const body = data.body || 'Protocol reminder.';
    event.waitUntil(
      self.registration.showNotification(title, {
        body: body,
        icon: '/logo-icon.png',
        badge: '/logo-icon.png',
        tag: 'welbuddy-instant-' + Date.now(),
        renotify: true,
        vibrate: [200, 100, 200],
        data: { url: data.url || '/coach' }
      })
    );
  }
});
