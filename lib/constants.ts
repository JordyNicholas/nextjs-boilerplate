export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333';

export const AUTH_MODE =
  process.env.NEXT_PUBLIC_AUTH_MODE === 'direct' ||
  process.env.NEXT_PUBLIC_AUTH_MODE === 'bff'
    ? process.env.NEXT_PUBLIC_AUTH_MODE
    : process.env.NODE_ENV === 'production'
      ? 'bff'
      : 'direct';

export const DEFAULT_TENANT_ID =
  process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID ?? '00000000-0000-4000-8000-000000000001';

export const ACCESS_TOKEN_KEY = 'ts-monolith:accessToken';
export const REFRESH_TOKEN_KEY = 'ts-monolith:refreshToken';
