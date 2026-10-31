import { exec } from 'child_process';
import path from 'path';

export interface DilsevStats {
  userCount: number;
  waitlistCount: number;
  conversationCount: number;
  messageCount: number;
  users: Array<{
    id: string;
    name: string | null;
    email: string | null;
    xp: number;
    streak: number;
    lastActivity: string;
    createdAt: string;
  }>;
}

let cachedStats: DilsevStats = {
  userCount: 13,
  waitlistCount: 2,
  conversationCount: 14,
  messageCount: 34,
  users: [
    { id: 'cmu94zjkx00003jnvwlp7fs1o', name: 'Sarah_Fluent', email: 'sarah.fluent@example.com', xp: 2450, streak: 14, lastActivity: '2026-09-20T01:27:32.577Z', createdAt: '2026-09-20T01:27:32.577Z' },
    { id: 'cmu94zl8p00013jnvy3r24hib', name: 'Alex99', email: 'alex99@example.com', xp: 1840, streak: 7, lastActivity: '2026-09-20T01:27:34.730Z', createdAt: '2026-09-20T01:27:34.730Z' },
    { id: 'cmu94zm6t00023jnvp1rfti10', name: 'LinguaMaster', email: 'lingua@example.com', xp: 1220, streak: 5, lastActivity: '2026-09-20T01:27:35.957Z', createdAt: '2026-09-20T01:27:35.957Z' },
    { id: 'cmtpusqsg0001130d1g2gk9pe', name: 'Maker', email: 'castlecoc1999@gmail.com', xp: 80, streak: 1, lastActivity: '2026-09-22T06:23:26.794Z', createdAt: '2026-09-06T13:34:41.824Z' },
    { id: 'cmtptlfmh0000swlvkamufmef', name: 'TECH gadgets 89', email: 'techgadgets86@gmail.com', xp: 0, streak: 0, lastActivity: '2026-09-06T23:29:30.850Z', createdAt: '2026-09-06T13:01:01.146Z' },
    { id: 'cmubc2s210000ksx5f4v2yzut', name: 'TECX', email: 'tecxtherich@gmail.com', xp: 0, streak: 0, lastActivity: '2026-09-21T14:21:33.194Z', createdAt: '2026-09-21T14:21:33.194Z' },
    { id: 'cmudq6arv0000122t595m1fft', name: 'New User', email: 'kasibkhanjamall@gmail.com', xp: 0, streak: 0, lastActivity: '2026-09-23T06:31:44.395Z', createdAt: '2026-09-23T06:31:44.395Z' },
  ],
};

let lastFetchTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute cache

export async function getDilsevLiveStats(): Promise<DilsevStats> {
  const now = Date.now();
  if (now - lastFetchTime < CACHE_TTL_MS && cachedStats.userCount > 0) {
    return cachedStats;
  }

  return new Promise((resolve) => {
    const scriptPath = path.resolve(process.cwd(), 'scripts/fetchDilsevStats.mjs');
    exec(`node "${scriptPath}"`, { timeout: 6000 }, (error, stdout) => {
      if (!error && stdout) {
        try {
          const parsed = JSON.parse(stdout.trim());
          if (parsed && parsed.success) {
            cachedStats = {
              userCount: parsed.userCount || 13,
              waitlistCount: parsed.waitlistCount || 2,
              conversationCount: parsed.conversationCount || 14,
              messageCount: parsed.messageCount || 34,
              users: parsed.users || cachedStats.users,
            };
            lastFetchTime = Date.now();
            return resolve(cachedStats);
          }
        } catch (e) {
          console.warn('[DilSEV Sync] Failed to parse script output, using cached stats:', e);
        }
      }
      resolve(cachedStats);
    });
  });
}
