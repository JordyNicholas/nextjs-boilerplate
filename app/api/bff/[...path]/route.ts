import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_API_URL } from '@/lib/api/serverConfig';
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  secureCookieOptions,
} from '@/lib/auth/cookies';
import { rejectUntrustedMutation } from '@/lib/auth/csrf';

async function proxy(request: NextRequest, path: string[]) {
  try {
    return await proxyUpstream(request, path);
  } catch {
    return NextResponse.json({ message: 'Backend API is unavailable' }, { status: 504 });
  }
}

async function proxyUpstream(request: NextRequest, path: string[]) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const rejected = rejectUntrustedMutation(request);
    if (rejected) return rejected;
  }

  let accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  const body = request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.text();
  const search = request.nextUrl.search;
  const tenantId = request.headers.get('x-tenant-id');
  const requestId = request.headers.get('x-request-id') ?? crypto.randomUUID();

  const send = (token?: string) =>
    fetch(`${BACKEND_API_URL}/${path.join('/')}${search}`, {
      method: request.method,
      headers: {
        accept: 'application/json',
        ...(body
          ? { 'content-type': request.headers.get('content-type') ?? 'application/json' }
          : {}),
        ...(token ? { authorization: `Bearer ${token}` } : {}),
        ...(tenantId ? { 'x-tenant-id': tenantId } : {}),
        'x-request-id': requestId,
      },
      body,
      signal: AbortSignal.timeout(10_000),
    });

  let response = await send(accessToken);
  let rotatedTokens: { accessToken: string; refreshToken: string } | null = null;
  let clearSession = false;

  if (response.status === 401 && refreshToken) {
    const refreshResponse = await fetch(`${BACKEND_API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      signal: AbortSignal.timeout(10_000),
    });

    if (refreshResponse.ok) {
      rotatedTokens = (await refreshResponse.json()) as {
        accessToken: string;
        refreshToken: string;
      };
      accessToken = rotatedTokens.accessToken;
      response = await send(accessToken);
    } else {
      clearSession = true;
    }
  }

  const responseHeaders = {
    'x-request-id': response.headers.get('x-request-id') ?? requestId,
  };
  const nextResponse = new NextResponse(
    response.status === 204 ? null : await response.text(),
    {
      status: response.status,
      headers: {
        ...responseHeaders,
        ...(response.status === 204
          ? {}
          : { 'content-type': response.headers.get('content-type') ?? 'application/json' }),
      },
    },
  );

  if (rotatedTokens) {
    nextResponse.cookies.set(ACCESS_COOKIE, rotatedTokens.accessToken, {
      ...secureCookieOptions,
      maxAge: 15 * 60,
    });
    nextResponse.cookies.set(REFRESH_COOKIE, rotatedTokens.refreshToken, {
      ...secureCookieOptions,
      maxAge: 7 * 24 * 60 * 60,
    });
  } else if (clearSession) {
    nextResponse.cookies.delete(ACCESS_COOKIE);
    nextResponse.cookies.delete(REFRESH_COOKIE);
  }

  return nextResponse;
}

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(request: NextRequest, context: RouteContext) {
  return proxy(request, (await context.params).path);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return proxy(request, (await context.params).path);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return proxy(request, (await context.params).path);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return proxy(request, (await context.params).path);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return proxy(request, (await context.params).path);
}
