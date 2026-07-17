import { API_URL, AUTH_MODE } from '@/lib/constants';
import {
  clearTokens,
  getRefreshToken,
  setTokens,
} from '@/lib/auth/storage';
import type { ApiError } from './types';

type RequestOptions = {
  method?: string;
  body?: unknown;
  accessToken?: string | null;
  tenantId?: string;
  headers?: Record<string, string>;
  retryOnUnauthorized?: boolean;
};

export class ApiClientError extends Error {
  status: number;
  issues?: ApiError['issues'];

  constructor(status: number, message: string, issues?: ApiError['issues']) {
    super(message);
    this.status = status;
    this.issues = issues;
  }
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const {
    method = 'GET',
    body,
    accessToken,
    tenantId,
    headers = {},
    retryOnUnauthorized = true,
  } = options;

  const requestHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...headers,
  };

  if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  if (AUTH_MODE === 'direct' && accessToken) {
    requestHeaders.Authorization = `Bearer ${accessToken}`;
  }

  if (tenantId) {
    requestHeaders['x-tenant-id'] = tenantId;
  }

  const url = AUTH_MODE === 'bff' ? `/api/bff${path}` : `${API_URL}${path}`;

  let response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (
    AUTH_MODE === 'direct' &&
    response.status === 401 &&
    accessToken &&
    retryOnUnauthorized
  ) {
    const refreshedToken = await tryRefreshSession();
    if (refreshedToken) {
      requestHeaders.Authorization = `Bearer ${refreshedToken}`;
      response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    }
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  const data = text ? (JSON.parse(text) as unknown) : null;

  if (!response.ok) {
    const error = data as ApiError | null;
    throw new ApiClientError(
      response.status,
      error?.message ?? `Request failed (${response.status})`,
      error?.issues,
    );
  }

  return data as T;
}

async function tryRefreshSession(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      clearTokens();
      window.dispatchEvent(new CustomEvent('auth:cleared'));
      return null;
    }

    const tokens = (await response.json()) as {
      accessToken: string;
      refreshToken: string;
    };
    setTokens(tokens.accessToken, tokens.refreshToken);
    window.dispatchEvent(
      new CustomEvent('auth:updated', { detail: { accessToken: tokens.accessToken } }),
    );
    return tokens.accessToken;
  } catch {
    return null;
  }
}
