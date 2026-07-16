export type ApiError = {
  message: string;
  issues?: Array<{ path: string; message: string }>;
};

export type HealthResponse = { status: string };
export type ReadyResponse = { status: string; message?: string };
export type MetricsResponse = {
  service: string;
  totalRequests: number;
  totalErrors: number;
  uptimeSeconds: number;
  startedAt: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: { id: string; name: string };
};

export type RegisterResponse = {
  id: string;
  email: string;
  name: string;
};

export type ProfileResponse = {
  id: string;
  email: string;
  name: string;
  tenantId: string;
};

export type ReportItem = {
  id: string;
  title: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  tenantId: string;
  createdAt: string;
};

export type PaginatedReports = {
  data: ReportItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
