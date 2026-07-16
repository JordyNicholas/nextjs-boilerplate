import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/lib/constants';
import { ACCESS_COOKIE, REFRESH_COOKIE, secureCookieOptions } from '@/lib/auth/cookies';

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  if (!refreshToken) {
    return NextResponse.json({ message: 'Refresh token is missing' }, { status: 401 });
  }

  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  const data = await response.json();

  if (!response.ok) {
    const nextResponse = NextResponse.json(data, { status: response.status });
    nextResponse.cookies.delete(ACCESS_COOKIE);
    nextResponse.cookies.delete(REFRESH_COOKIE);
    return nextResponse;
  }

  const nextResponse = NextResponse.json({ ok: true });
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
