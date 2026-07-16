'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiClientError } from '@/lib/api/client';
import { useAuth } from '@/lib/auth/AuthProvider';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const router = useRouter();
  const { login, refreshSession } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      router.push('/profile');
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    setRefreshMessage(null);
    const ok = await refreshSession();
    setRefreshMessage(ok ? 'Session refreshed successfully.' : 'No valid refresh token found.');
  }

  return (
    <div className="mx-auto grid max-w-lg gap-6">
      <Card title="POST /auth/login" description="Authenticate and receive access + refresh tokens.">
        <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error ? <Alert tone="error">{error}</Alert> : null}
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </Card>

      <Card title="POST /auth/refresh" description="Rotate refresh token using stored credentials.">
        <div className="flex flex-col gap-3">
          {refreshMessage ? <Alert tone="info">{refreshMessage}</Alert> : null}
          <Button variant="secondary" onClick={() => void handleRefresh()}>
            Refresh session
          </Button>
        </div>
      </Card>
    </div>
  );
}
