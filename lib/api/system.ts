import { apiFetch } from './client';
import type { HealthResponse, MetricsResponse, ReadyResponse } from './types';

export function getHealth() {
  return apiFetch<HealthResponse>('/health');
}

export function getReady() {
  return apiFetch<ReadyResponse>('/ready');
}

export function getMetrics() {
  return apiFetch<MetricsResponse>('/metrics');
}
