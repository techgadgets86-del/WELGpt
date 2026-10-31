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
