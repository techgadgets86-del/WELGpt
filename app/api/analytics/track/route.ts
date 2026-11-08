import { NextResponse } from 'next/server';
import { recordSession, COUNTRY_NAMES } from '@/lib/analyticsStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Helper to deduce country code from Timezone if geolocation headers are absent (e.g. localhost or plain proxy)
function deduceCountryFromTimezone(tz?: string): { code: string; name: string } {
  if (!tz) return { code: 'US', name: 'United States' };
  
  if (tz.includes('New_York') || tz.includes('Los_Angeles') || tz.includes('Chicago') || tz.includes('Denver')) {
    return { code: 'US', name: 'United States' };
  }
  if (tz.includes('London') || tz.includes('Belfast')) {
    return { code: 'GB', name: 'United Kingdom' };
  }
  if (tz.includes('Toronto') || tz.includes('Vancouver') || tz.includes('Montreal')) {
    return { code: 'CA', name: 'Canada' };
  }
  if (tz.includes('Berlin') || tz.includes('Frankfurt')) {
    return { code: 'DE', name: 'Germany' };
  }
  if (tz.includes('Sydney') || tz.includes('Melbourne') || tz.includes('Brisbane') || tz.includes('Perth')) {
    return { code: 'AU', name: 'Australia' };
  }
  if (tz.includes('Karachi') || tz.includes('Islamabad') || tz.includes('Lahore')) {
    return { code: 'PK', name: 'Pakistan' };
  }
  if (tz.includes('Kolkata') || tz.includes('Calcutta') || tz.includes('Mumbai') || tz.includes('Delhi')) {
    return { code: 'IN', name: 'India' };
  }
  if (tz.includes('Paris')) return { code: 'FR', name: 'France' };
  if (tz.includes('Tokyo')) return { code: 'JP', name: 'Japan' };
  if (tz.includes('Dubai')) return { code: 'AE', name: 'United Arab Emirates' };
  if (tz.includes('Singapore')) return { code: 'SG', name: 'Singapore' };
  if (tz.includes('Amsterdam')) return { code: 'NL', name: 'Netherlands' };
  
  return { code: 'US', name: 'United States' };
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const headers = req.headers;

    // 1. Extract IP
    const forwardedFor = headers.get('x-forwarded-for');
    const realIp = headers.get('x-real-ip');
    let rawIp = forwardedFor ? forwardedFor.split(',')[0].trim() : (realIp || '127.0.0.1');
    if (rawIp === '::1' || rawIp === '127.0.0.1') {
      rawIp = '74.125.190.27'; // Standard fallback IP for geo demonstration
    }
    const ipParts = rawIp.split('.');
    const maskedIp = ipParts.length === 4 ? `${ipParts[0]}.${ipParts[1]}.***.***` : rawIp;

    // 2. Extract Country & City from headers or timezone fallback
    let countryCode = headers.get('x-vercel-ip-country') || headers.get('cf-ipcountry') || headers.get('x-country-code');
    let countryName = countryCode && COUNTRY_NAMES[countryCode] ? COUNTRY_NAMES[countryCode].name : undefined;
    let city = headers.get('x-vercel-ip-city') || body.city;

    if (!countryCode || countryCode === 'XX') {
      const deduced = deduceCountryFromTimezone(body.timezone);
      countryCode = deduced.code;
      countryName = deduced.name;
    }

    if (!countryName && countryCode && COUNTRY_NAMES[countryCode]) {
      countryName = COUNTRY_NAMES[countryCode].name;
    }

    // 3. Device detection
    const userAgent = headers.get('user-agent') || body.userAgent || '';
    let device: 'mobile' | 'desktop' | 'tablet' = 'desktop';
    if (/tablet|ipad/i.test(userAgent)) {
      device = 'tablet';
    } else if (/mobile|iphone|android/i.test(userAgent)) {
      device = 'mobile';
    }

    // Browser & OS detection
    let browser = 'Chrome';
    if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) browser = 'Safari';
    else if (/firefox/i.test(userAgent)) browser = 'Firefox';
    else if (/edg/i.test(userAgent)) browser = 'Edge';

    let os = 'macOS';
    if (/windows/i.test(userAgent)) os = 'Windows';
    else if (/android/i.test(userAgent)) os = 'Android';
    else if (/iphone|ipad|ios/i.test(userAgent)) os = 'iOS';
    else if (/linux/i.test(userAgent)) os = 'Linux';

    // 4. Record session
    const session = recordSession({
      sessionId: body.sessionId || `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      visitorId: body.visitorId || `vis_${Date.now()}`,
      appId: body.appId === 'dilsev' ? 'dilsev' : 'welgpt',
      userId: body.userId || null,
      userEmail: body.userEmail || null,
      durationSeconds: typeof body.durationSeconds === 'number' ? body.durationSeconds : undefined,
      country: countryName || 'United States',
      countryCode: countryCode || 'US',
      city: city || 'Local Area',
      device: body.device || device,
      browser: body.browser || browser,
      os: body.os || os,
      ip: maskedIp,
      page: body.page,
      feature: body.feature,
      source: body.source || 'app',
    });

    const res = NextResponse.json({
      success: true,
      sessionId: session.sessionId,
      duration: session.durationSeconds,
    });
    res.headers.set('Access-Control-Allow-Origin', '*');
    res.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return res;
  } catch (err: unknown) {
    console.error('[Analytics Track API] Error:', err);
    const fallbackRes = NextResponse.json(
      { success: true, offline: true },
      { status: 200 }
    );
    fallbackRes.headers.set('Access-Control-Allow-Origin', '*');
    fallbackRes.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    fallbackRes.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return fallbackRes;
  }
}

export async function OPTIONS() {
  const res = new NextResponse(null, { status: 204 });
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return res;
}
