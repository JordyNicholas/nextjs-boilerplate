import { apiFetch } from './client';
import type { LoginResponse } from './types';

export function login(email: string, password: string, tenantId: string) {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: { email, password },
    tenantId,
  });
}

export function refresh(refreshToken: string) {
  return apiFetch<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
    method: 'POST',
    body: { refreshToken },
  });
}

export function logout(accessToken: string, refreshToken?: string) {
  return apiFetch<void>('/auth/logout', {
    method: 'POST',
    accessToken,
    body: refreshToken ? { refreshToken } : {},
  });
}
