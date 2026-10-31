import { NextResponse } from 'next/server';
import { getAnalyticsReport } from '@/lib/analyticsStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = await getAnalyticsReport();
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
