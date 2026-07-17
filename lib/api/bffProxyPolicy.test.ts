import { describe, expect, test } from 'vitest';
import { isBffRouteAllowed, parseBffRouteRules } from './bffProxyPolicy';

describe('BFF proxy policy', () => {
  test('allows only configured method and path combinations', () => {
    const rules = parseBffRouteRules('GET:/users/me, POST:/reports/');

    expect(isBffRouteAllowed('GET', ['users', 'me'], rules)).toBe(true);
    expect(isBffRouteAllowed('POST', ['reports'], rules)).toBe(true);
    expect(isBffRouteAllowed('DELETE', ['reports'], rules)).toBe(false);
  });

  test('supports explicit descendant wildcards', () => {
    const rules = parseBffRouteRules('GET:/vaults/*');

    expect(isBffRouteAllowed('GET', ['vaults', 'vault-id'], rules)).toBe(true);
    expect(isBffRouteAllowed('GET', ['vaults'], rules)).toBe(true);
    expect(isBffRouteAllowed('POST', ['vaults', 'vault-id'], rules)).toBe(false);
  });

  test('rejects unsafe path segments', () => {
    const rules = parseBffRouteRules('GET:/users/*');

    expect(isBffRouteAllowed('GET', ['users', '..'], rules)).toBe(false);
    expect(isBffRouteAllowed('GET', ['users', 'nested/path'], rules)).toBe(false);
    expect(isBffRouteAllowed('GET', ['users', 'nested\\path'], rules)).toBe(false);
  });

  test('rejects malformed configuration', () => {
    expect(() => parseBffRouteRules('GET /users/me')).toThrow(
      'Expected METHOD:/path',
    );
  });
});
