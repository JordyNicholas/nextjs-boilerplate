import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

describe('apiFetch authentication modes', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ id: 'user-1' }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        }),
      ),
    );
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  test('uses the same-origin BFF without exposing bearer tokens', async () => {
    vi.stubEnv('NEXT_PUBLIC_AUTH_MODE', 'bff');
    const { apiFetch } = await import('./client');

    await apiFetch('/users/me', {
      accessToken: 'cookie-session',
      tenantId: 'tenant-1',
    });

    expect(fetch).toHaveBeenCalledWith(
      '/api/bff/users/me',
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-tenant-id': 'tenant-1',
        }),
      }),
    );
    const request = vi.mocked(fetch).mock.calls[0]?.[1];
    expect(new Headers(request?.headers).has('authorization')).toBe(false);
  });

  test('sends bearer tokens only in direct mode', async () => {
    vi.stubEnv('NEXT_PUBLIC_AUTH_MODE', 'direct');
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://api.example.com');
    const { apiFetch } = await import('./client');

    await apiFetch('/users/me', { accessToken: 'access-token' });

    expect(fetch).toHaveBeenCalledWith(
      'https://api.example.com/users/me',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer access-token',
        }),
      }),
    );
  });
});
