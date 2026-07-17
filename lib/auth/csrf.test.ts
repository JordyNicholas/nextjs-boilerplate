import { NextRequest } from 'next/server';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { rejectUntrustedMutation } from './csrf';

afterEach(() => {
  vi.unstubAllEnvs();
  delete process.env.BFF_ALLOWED_ORIGINS;
});

describe('rejectUntrustedMutation', () => {
  test('allows a same-origin browser request', () => {
    const request = new NextRequest('https://app.example.com/api/bff/reports', {
      method: 'POST',
      headers: { origin: 'https://app.example.com' },
    });

    expect(rejectUntrustedMutation(request)).toBeNull();
  });

  test('rejects a cross-origin browser request', async () => {
    const request = new NextRequest('https://app.example.com/api/bff/reports', {
      method: 'POST',
      headers: { origin: 'https://attacker.example' },
    });

    const response = rejectUntrustedMutation(request);
    expect(response?.status).toBe(403);
    await expect(response?.json()).resolves.toEqual({ message: 'Origin is not allowed' });
  });

  test('requires an origin header in production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    const request = new NextRequest('https://app.example.com/api/bff/reports', {
      method: 'POST',
    });

    expect(rejectUntrustedMutation(request)?.status).toBe(403);
  });

  test('allows an explicitly configured application origin', () => {
    process.env.BFF_ALLOWED_ORIGINS = 'https://admin.example.com';
    const request = new NextRequest('https://app.example.com/api/bff/reports', {
      method: 'POST',
      headers: { origin: 'https://admin.example.com' },
    });

    expect(rejectUntrustedMutation(request)).toBeNull();
  });
});
