import 'server-only';
import { parseBffRouteRules } from './bffProxyPolicy';

export const BACKEND_API_URL =
  process.env.BACKEND_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost:3333';

const DEFAULT_BFF_ALLOWED_ROUTES = [
  'GET:/health',
  'GET:/ready',
  'GET:/metrics',
  'POST:/users',
  'GET:/users/me',
  'GET:/reports',
  'POST:/reports',
].join(',');

export const BFF_ALLOWED_ROUTES = parseBffRouteRules(
  process.env.BFF_ALLOWED_ROUTES ?? DEFAULT_BFF_ALLOWED_ROUTES,
);
