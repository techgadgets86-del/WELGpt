import { NextResponse } from 'next/server';
import { getAnalyticsReport } from '@/lib/analyticsStore';
import { verifyAdminRequest } from '@/lib/adminAuthServer';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const authResult = await verifyAdminRequest(req);
    if (!authResult.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required with official company email' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const app = searchParams.get('app') || 'welgpt';
    const report = await getAnalyticsReport(app);
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...report,
    });
  } catch (err: unknown) {
    console.error('[Analytics Stats API] Error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to generate analytics report' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  const res = new NextResponse(null, { status: 204 });
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-key');
  return res;
}
