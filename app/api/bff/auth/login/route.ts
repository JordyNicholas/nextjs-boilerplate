import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_TENANT_ID } from '@/lib/constants';
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

  const body = await request.text();
  const tenantId = request.headers.get('x-tenant-id') ?? DEFAULT_TENANT_ID;
  let response: Response;
  try {
    response = await fetch(`${BACKEND_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-tenant-id': tenantId },
      body,
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    return NextResponse.json({ message: 'Backend API is unavailable' }, { status: 504 });
  }

  const data = (await readJson(response)) as {
    message?: string;
    user?: unknown;
    accessToken?: string;
    refreshToken?: string;
  };

  if (!response.ok) {
    return NextResponse.json(data, { status: response.status });
  }

  if (!data.accessToken || !data.refreshToken) {
    return NextResponse.json({ message: 'Backend login response was incomplete' }, { status: 502 });
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
