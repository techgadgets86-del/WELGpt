import { NextResponse } from 'next/server';
import { getAnalyticsReport } from '@/lib/analyticsStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = await getAnalyticsReport();
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
