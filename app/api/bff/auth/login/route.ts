import { NextRequest, NextResponse } from 'next/server';
import { API_URL, DEFAULT_TENANT_ID } from '@/lib/constants';
import { ACCESS_COOKIE, REFRESH_COOKIE, secureCookieOptions } from '@/lib/auth/cookies';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const tenantId = request.headers.get('x-tenant-id') ?? DEFAULT_TENANT_ID;
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-tenant-id': tenantId },
    body,
  });
  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(data, { status: response.status });
  }

  const nextResponse = NextResponse.json({ user: data.user });
  nextResponse.cookies.set(ACCESS_COOKIE, data.accessToken, {
    ...secureCookieOptions,
    maxAge: 15 * 60,
  });
  nextResponse.cookies.set(REFRESH_COOKIE, data.refreshToken, {
    ...secureCookieOptions,
    maxAge: 7 * 24 * 60 * 60,
  });
  return nextResponse;
}
