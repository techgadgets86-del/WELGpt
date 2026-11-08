// VAPID configuration for Web Push Notifications
// These allow browsers (Safari iOS 16.4+, Chrome, Firefox, Edge) to deliver
// push notifications even when the app is completely closed or phone is locked.

export const VAPID_PUBLIC_KEY = 
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  'BLlvjIYxXGn-j-rwfzoOThVojfEN_x06TeYoNchq6gJbKOaK_b0bFhyAoH2aCAKSuIqqtLNyYDQp4P_chB5iBW0';

export const VAPID_PRIVATE_KEY = 
  process.env.VAPID_PRIVATE_KEY ||
  'r6NJzjWtNry7ZFHeUu9kL4GpzfQv4gZmy5LNcmxdvEo';

export const VAPID_SUBJECT = 
  process.env.VAPID_SUBJECT || 
  'mailto:support@welgpt.space';
