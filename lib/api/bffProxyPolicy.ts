export type BffRouteRule = {
  method: string;
  path: string;
  includeDescendants: boolean;
};

export function parseBffRouteRules(input: string): BffRouteRule[] {
  return input
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => {
      const separator = value.indexOf(':');
      const method = value.slice(0, separator).trim().toUpperCase();
      const configuredPath = value.slice(separator + 1).trim();

      if (separator < 1 || !/^[A-Z]+$/.test(method) || !configuredPath.startsWith('/')) {
        throw new Error(`Invalid BFF route rule: "${value}". Expected METHOD:/path.`);
      }

      const includeDescendants = configuredPath.endsWith('/*');
      const path = normalizePath(
        includeDescendants ? configuredPath.slice(0, -2) : configuredPath,
      );

      return { method, path, includeDescendants };
    });
}

export function isBffRouteAllowed(
  method: string,
  pathSegments: string[],
  rules: BffRouteRule[],
): boolean {
  if (
    pathSegments.length === 0 ||
    pathSegments.some(
      (segment) =>
        !segment ||
        segment === '.' ||
        segment === '..' ||
        segment.includes('/') ||
        segment.includes('\\'),
    )
  ) {
    return false;
  }

  const path = normalizePath(`/${pathSegments.join('/')}`);
  const normalizedMethod = method.toUpperCase();

  return rules.some(
    (rule) =>
      rule.method === normalizedMethod &&
      (path === rule.path ||
        (rule.includeDescendants && path.startsWith(`${rule.path}/`))),
  );
}

function normalizePath(path: string): string {
  return path.length > 1 ? path.replace(/\/+$/, '') : path;
}
