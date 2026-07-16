import { apiFetch } from './client';
import type { CreateReportResponse, PaginatedReports } from './types';

export function listReports(accessToken: string, page = 1, limit = 10) {
  return apiFetch<PaginatedReports>(`/reports/?page=${page}&limit=${limit}`, {
    accessToken,
  });
}

export function createReport(accessToken: string, title: string) {
  return apiFetch<CreateReportResponse>('/reports/', {
    method: 'POST',
    accessToken,
    body: { title },
  });
}
