import { apiFetch } from './client';
import type { ProfileResponse, RegisterResponse } from './types';

export function register(
  data: { name: string; email: string; password: string },
  tenantId: string,
) {
  return apiFetch<RegisterResponse>('/users/', {
    method: 'POST',
    body: data,
    tenantId,
  });
}

export function getProfile(accessToken: string) {
  return apiFetch<ProfileResponse>('/users/me', { accessToken });
}
