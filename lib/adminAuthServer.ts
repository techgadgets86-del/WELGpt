import { isOfficialAdminEmail } from './adminAuth';

/**
 * Server-side verification for API routes.
 * Inspects Authorization: Bearer <token> or returns false if unauthorized.
 */
export async function verifyAdminRequest(
  req: Request
): Promise<{ isAdmin: boolean; email?: string; error?: string }> {
  try {
    // 1. Secret cron/admin key fallback (for automated telemetry scripts)
    const adminKey = req.headers.get('x-admin-key');
    if (adminKey && process.env.CRON_SECRET && adminKey === process.env.CRON_SECRET) {
      return { isAdmin: true, email: 'admin@welgpt.space' };
    }

    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { isAdmin: false, error: 'Missing or invalid authorization header' };
    }

    const token = authHeader.substring(7).trim();
    if (!token) {
      return { isAdmin: false, error: 'Empty authorization bearer token' };
    }

    const { adminAuth } = await import('./firebaseAdmin');
    const decoded = await adminAuth.verifyIdToken(token);
    const email = decoded.email || null;

    if (!isOfficialAdminEmail(email)) {
      return {
        isAdmin: false,
        email: email || undefined,
        error: 'User is not authorized as an official company administrator',
      };
    }

    return { isAdmin: true, email: email || undefined };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to verify admin token';
    return { isAdmin: false, error: message };
  }
}
