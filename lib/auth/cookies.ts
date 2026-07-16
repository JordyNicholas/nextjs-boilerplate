export const ACCESS_COOKIE = 'ts-monolith-access';
export const REFRESH_COOKIE = 'ts-monolith-refresh';

export const secureCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};
