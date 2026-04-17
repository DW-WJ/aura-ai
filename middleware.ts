import { NextRequest, NextResponse } from 'next/server';

// 白名单：跳过静态资源和内部路径
const SKIP_PATHS = [
  '/_next/', '/favicon', '/manifest.json', '/icon',
  '/api/', '/auth/', '/admin/', '/opengraph',
  '.ico', '.png', '.jpg', '.svg', '.woff', '.css', '.js',
];

// 简化指纹：IP + UA 前64位
function makeFingerprint(ip: string, ua: string): string {
  const raw = (ip + ua).replace(/\s+/g, '').slice(0, 64);
  // 简单哈希
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'm_' + Math.abs(hash).toString(16);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 跳过静态资源和 API
  if (SKIP_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // 生成指纹
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || '';
  const ua = request.headers.get('user-agent') || '';
  const fingerprint = makeFingerprint(ip, ua);

  // 非阻塞上报（fire-and-forget）
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  fetch(baseUrl + '/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'pageview',
      data: {
        fingerprint,
        visitorIp: ip,
        path: pathname,
        referrer: request.headers.get('referer') || '',
      },
    }),
  }).catch(() => {}); // 静默失败

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).)*',
  ],
};
