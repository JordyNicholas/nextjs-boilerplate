import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/lib/constants';
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  secureCookieOptions,
} from '@/lib/auth/cookies';

async function proxy(request: NextRequest, path: string[]) {
  let accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  const body = request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.text();
  const search = request.nextUrl.search;

  const send = (token?: string) =>
    fetch(`${API_URL}/${path.join('/')}${search}`, {
      method: request.method,
      headers: {
        accept: 'application/json',
        ...(body
          ? { 'content-type': request.headers.get('content-type') ?? 'application/json' }
          : {}),
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      body,
    });

  let response = await send(accessToken);
  let rotatedTokens: { accessToken: string; refreshToken: string } | null = null;

  if (response.status === 401 && refreshToken) {
    const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (refreshResponse.ok) {
      rotatedTokens = (await refreshResponse.json()) as {
        accessToken: string;
        refreshToken: string;
      };
      accessToken = rotatedTokens.accessToken;
      response = await send(accessToken);
    }
  }

  if (response.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const nextResponse = new NextResponse(await response.text(), {
    status: response.status,
    headers: { 'content-type': response.headers.get('content-type') ?? 'application/json' },
  });

  if (rotatedTokens) {
    nextResponse.cookies.set(ACCESS_COOKIE, rotatedTokens.accessToken, {
      ...secureCookieOptions,
      maxAge: 15 * 60,
    });
    nextResponse.cookies.set(REFRESH_COOKIE, rotatedTokens.refreshToken, {
      ...secureCookieOptions,
      maxAge: 7 * 24 * 60 * 60,
    });
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
