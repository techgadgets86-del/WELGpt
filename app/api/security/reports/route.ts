import { NextResponse } from 'next/server';
import { getAnalyticsReport } from '@/lib/analyticsStore';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const app = searchParams.get('app') || 'all';
    const report = await getAnalyticsReport(app);
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      security: report.security,
      activeUsers: report.overview.weeklyActiveUsers,
    });
  } catch (err: unknown) {
    console.error('[Security Reports API] Error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to retrieve security reports' },
      { status: 500 }
    );
  }
}
