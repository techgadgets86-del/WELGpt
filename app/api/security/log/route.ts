import { NextResponse } from 'next/server';
import { logSecurityEvent, COUNTRY_NAMES } from '@/lib/analyticsStore';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const headers = req.headers;

    const forwardedFor = headers.get('x-forwarded-for');
    const realIp = headers.get('x-real-ip');
    let rawIp = forwardedFor ? forwardedFor.split(',')[0].trim() : (realIp || '127.0.0.1');
    if (rawIp === '::1' || rawIp === '127.0.0.1') {
      rawIp = '74.125.190.27';
    }
    const ipParts = rawIp.split('.');
    const maskedIp = ipParts.length === 4 ? `${ipParts[0]}.${ipParts[1]}.***.***` : rawIp;

    let countryCode = headers.get('x-vercel-ip-country') || headers.get('cf-ipcountry') || body.countryCode || 'US';
    let countryName = COUNTRY_NAMES[countryCode]?.name || body.country || 'United States';

    const event = logSecurityEvent({
      type: body.type || 'AUTH_SUCCESS',
      severity: body.severity || 'INFO',
      description: body.description || 'Security audit log entry',
      ip: maskedIp,
      country: countryName,
      countryCode: countryCode,
      userAgent: headers.get('user-agent') || body.userAgent,
      status: body.status || 'ALLOWED',
    });

    return NextResponse.json({ success: true, eventId: event.id });
  } catch (err: unknown) {
    console.error('[Security Log API] Error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to log security event' },
      { status: 500 }
    );
  }
}
