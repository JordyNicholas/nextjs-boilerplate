import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/lib/constants';
import { ACCESS_COOKIE, REFRESH_COOKIE } from '@/lib/auth/cookies';

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;

  if (accessToken) {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${accessToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    }).catch(() => undefined);
  }

  const response = new NextResponse(null, { status: 204 });
  response.cookies.delete(ACCESS_COOKIE);
  response.cookies.delete(REFRESH_COOKIE);
  return response;
}
