import { NextResponse } from 'next/server';
import { getAnalyticsReport } from '@/lib/analyticsStore';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const app = searchParams.get('app') || 'all';
    const report = await getAnalyticsReport(app);
    const res = NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      security: report.security,
      activeUsers: report.overview.weeklyActiveUsers,
    });
    res.headers.set('Access-Control-Allow-Origin', '*');
    res.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return res;
  } catch (err: unknown) {
    console.error('[Security Reports API] Error:', err);
    const errRes = NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to retrieve security reports' },
      { status: 500 }
    );
    errRes.headers.set('Access-Control-Allow-Origin', '*');
    return errRes;
  }
}

export async function OPTIONS() {
  const res = new NextResponse(null, { status: 204 });
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return res;
}
