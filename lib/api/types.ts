import type { paths } from './generated';

export type ApiError = {
  message: string;
  issues?: Array<{ path: string; message: string }>;
};

export type HealthResponse =
  paths['/health']['get']['responses'][200]['content']['application/json'];
export type ReadyResponse =
  paths['/ready']['get']['responses'][200]['content']['application/json'];
export type MetricsResponse =
  paths['/metrics']['get']['responses'][200]['content']['application/json'];
export type LoginResponse =
  paths['/auth/login']['post']['responses'][200]['content']['application/json'];
export type RegisterResponse =
  paths['/users/']['post']['responses'][201]['content']['application/json'];
export type ProfileResponse =
  paths['/users/me']['get']['responses'][200]['content']['application/json'];
export type PaginatedReports =
  paths['/reports/']['get']['responses'][200]['content']['application/json'];
export type ReportItem = PaginatedReports['data'][number];
export type CreateReportResponse =
  paths['/reports/']['post']['responses'][201]['content']['application/json'];
