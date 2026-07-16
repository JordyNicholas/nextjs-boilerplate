import { API_URL } from '@/lib/constants';
import type { ApiError } from './types';

type RequestOptions = {
  method?: string;
  body?: unknown;
  accessToken?: string | null;
  tenantId?: string;
  headers?: Record<string, string>;
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
  const { method = 'GET', body, accessToken, tenantId, headers = {} } = options;

  const requestHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...headers,
  };

  if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  if (accessToken) {
    requestHeaders.Authorization = `Bearer ${accessToken}`;
  }

  if (tenantId) {
    requestHeaders['x-tenant-id'] = tenantId;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

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
