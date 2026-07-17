import { NextRequest, NextResponse } from 'next/server';

export function rejectUntrustedMutation(request: NextRequest): NextResponse | null {
  const origin = request.headers.get('origin');

  if (!origin) {
    return process.env.NODE_ENV === 'production'
      ? NextResponse.json({ message: 'Origin header is required' }, { status: 403 })
      : null;
  }

  const configuredOrigins = (process.env.BFF_ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  const allowedOrigins = new Set([request.nextUrl.origin, ...configuredOrigins]);

  return allowedOrigins.has(origin)
    ? null
    : NextResponse.json({ message: 'Origin is not allowed' }, { status: 403 });
}
