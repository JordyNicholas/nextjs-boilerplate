'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ApiClientError } from '@/lib/api/client';
import { createReport, listReports } from '@/lib/api/reports';
import type { PaginatedReports, ReportItem } from '@/lib/api/types';
import { useAuth } from '@/lib/auth/AuthProvider';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';

const statusTone = {
  PENDING: 'warn',
  PROCESSING: 'info',
  COMPLETED: 'ok',
  FAILED: 'error',
} as const;

export default function ReportsPage() {
  return (
    <RequireAuth>
      <ReportsContent />
    </RequireAuth>
  );
}

function ReportsContent() {
  const { accessToken } = useAuth();
  const [reports, setReports] = useState<PaginatedReports | null>(null);
  const [title, setTitle] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const loadReports = useCallback(async (currentPage: number) => {
    if (!accessToken) return;
    setError(null);
    try {
      const data = await listReports(accessToken, currentPage, 10);
      setReports(data);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Failed to load reports');
    }
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    const initial = window.setTimeout(() => void loadReports(page), 0);
    return () => window.clearTimeout(initial);
  }, [accessToken, loadReports, page]);

  useEffect(() => {
    if (!accessToken || !reports?.data.some((report) => report.status === 'PENDING' || report.status === 'PROCESSING')) {
      return;
    }

    const interval = window.setInterval(() => {
      void loadReports(page);
    }, 2_000);

    return () => window.clearInterval(interval);
  }, [accessToken, loadReports, page, reports?.data]);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    if (!accessToken) return;
    setCreating(true);
    setError(null);
    try {
      await createReport(accessToken, title);
      toast.success('Report queued for processing');
      setTitle('');
      setPage(1);
      await loadReports(1);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Failed to create report');
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
      <Card title="POST /reports/" description="Create a report and enqueue background processing.">
        <form onSubmit={(e) => void handleCreate(e)} className="flex flex-col gap-4">
          <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Button type="submit" fullWidth disabled={creating}>
            {creating ? 'Creating…' : 'Create report'}
          </Button>
        </form>
      </Card>

      <Card title="GET /reports/" description="Paginated list of tenant-scoped reports.">
        {error ? <Alert tone="error">{error}</Alert> : null}

        <div className="mt-2 space-y-3">
          {reports?.data.length ? (
            reports.data.map((report: ReportItem) => (
              <article
                key={report.id}
                className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-950/60"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-slate-100">
                      {report.title}
                    </h3>
                    <p className="mt-1 font-mono text-xs text-slate-500 dark:text-slate-400">
                      {report.id}
                    </p>
                  </div>
                  <Badge tone={statusTone[report.status]}>{report.status}</Badge>
                </div>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  {new Date(report.createdAt).toLocaleString()}
                </p>
              </article>
            ))
          ) : (
            <EmptyState
              title="No reports yet"
              description="Create your first report to exercise the queue and worker flow."
            />
          )}
        </div>

        {reports ? (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Page {reports.meta.page} of {reports.meta.totalPages} · {reports.meta.total} total
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                disabled={page >= reports.meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
