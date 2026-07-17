import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_API_URL } from '@/lib/api/serverConfig';
import { ACCESS_COOKIE, REFRESH_COOKIE, secureCookieOptions } from '@/lib/auth/cookies';
import { rejectUntrustedMutation } from '@/lib/auth/csrf';

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return { message: 'Backend returned a non-JSON response' };
  }
}

export async function POST(request: NextRequest) {
  const rejected = rejectUntrustedMutation(request);
  if (rejected) return rejected;

  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  if (!refreshToken) {
    return NextResponse.json({ message: 'Refresh token is missing' }, { status: 401 });
  }

  let response: Response;
  try {
    response = await fetch(`${BACKEND_API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    return NextResponse.json({ message: 'Backend API is unavailable' }, { status: 504 });
  }

  const data = (await readJson(response)) as {
    message?: string;
    accessToken?: string;
    refreshToken?: string;
  };

  if (!response.ok) {
    const nextResponse = NextResponse.json(data, { status: response.status });
    nextResponse.cookies.delete(ACCESS_COOKIE);
    nextResponse.cookies.delete(REFRESH_COOKIE);
    return nextResponse;
  }

  if (!data.accessToken || !data.refreshToken) {
    const nextResponse = NextResponse.json(
      { message: 'Backend refresh response was incomplete' },
      { status: 502 },
    );
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
