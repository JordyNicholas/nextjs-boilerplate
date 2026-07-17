'use client';

import { useCallback, useEffect, useState } from 'react';
import { getHealth, getMetrics, getReady } from '@/lib/api/system';
import type { HealthResponse, MetricsResponse, ReadyResponse } from '@/lib/api/types';
import { ApiClientError } from '@/lib/api/client';
import { API_URL } from '@/lib/constants';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function StatusPage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [ready, setReady] = useState<ReadyResponse | null>(null);
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const loadStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    const startedAt = performance.now();
    try {
      const [healthRes, readyRes, metricsRes] = await Promise.all([
        getHealth(),
        getReady(),
        getMetrics(),
      ]);
      setHealth(healthRes);
      setReady(readyRes);
      setMetrics(metricsRes);
      setLatencyMs(Math.round(performance.now() - startedAt));
      setLastChecked(new Date());
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Failed to reach API');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initial = window.setTimeout(() => void loadStatus(), 0);
    const interval = window.setInterval(() => void loadStatus(), 30_000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(interval);
    };
  }, [loadStatus]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card
        title="API connection"
        description="Operational endpoints from the monolith boilerplate."
        className="lg:col-span-2"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
            <p>
              Base URL:{' '}
              <code className="rounded bg-slate-100 px-2 py-1 text-xs dark:bg-slate-800">
                {API_URL}
              </code>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Auto-refreshes every 30s
              {latencyMs !== null ? ` · ${latencyMs}ms` : ''}
              {lastChecked ? ` · ${lastChecked.toLocaleTimeString()}` : ''}
            </p>
          </div>
          <Button onClick={() => void loadStatus()} disabled={loading}>
            {loading ? 'Refreshing…' : 'Refresh status'}
          </Button>
        </div>
        {error ? (
          <div className="mt-4">
            <Alert tone="error">{error}</Alert>
          </div>
        ) : null}
      </Card>

      <Card title="GET /health">
        {health ? (
          <Badge tone={health.status === 'ok' ? 'ok' : 'warn'}>{health.status}</Badge>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading…</p>
        )}
      </Card>

      <Card title="GET /ready">
        {ready ? (
          <div className="flex flex-col gap-2">
            <Badge tone={ready.status === 'ready' ? 'ok' : 'error'}>{ready.status}</Badge>
            {ready.message ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">{ready.message}</p>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading…</p>
        )}
      </Card>

      <Card title="GET /metrics" className="lg:col-span-2">
        {metrics ? (
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Service
              </dt>
              <dd className="mt-1 font-medium text-slate-900 dark:text-slate-100">
                {metrics.service}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Requests
              </dt>
              <dd className="mt-1 font-medium text-slate-900 dark:text-slate-100">
                {metrics.totalRequests}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Errors
              </dt>
              <dd className="mt-1 font-medium text-slate-900 dark:text-slate-100">
                {metrics.totalErrors}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Uptime
              </dt>
              <dd className="mt-1 font-medium text-slate-900 dark:text-slate-100">
                {metrics.uptimeSeconds}s
              </dd>
            </div>
          </dl>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading…</p>
        )}
      </Card>
    </div>
  );
}
