'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiClientError } from '@/lib/api/client';
import { getProfile } from '@/lib/api/users';
import type { ProfileResponse } from '@/lib/api/types';
import { useAuth } from '@/lib/auth/AuthProvider';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingState } from '@/components/ui/LoadingState';

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileContent />
    </RequireAuth>
  );
}

function ProfileContent() {
  const router = useRouter();
  const { accessToken } = useAuth();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    void (async () => {
      try {
        const data = await getProfile(accessToken);
        setProfile(data);
      } catch (err) {
        setError(err instanceof ApiClientError ? err.message : 'Failed to load profile');
      }
    })();
  }, [accessToken]);

  return (
    <div className="mx-auto max-w-lg">
      <Card title="GET /users/me" description="Protected route — requires Bearer access token.">
        {error ? <Alert tone="error">{error}</Alert> : null}
        {profile ? (
          <dl className="mt-2 grid gap-4">
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Name</dt>
              <dd className="mt-1 font-medium">{profile.name}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Email</dt>
              <dd className="mt-1 font-medium">{profile.email}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Tenant ID</dt>
              <dd className="mt-1 break-all font-mono text-sm">{profile.tenantId}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">User ID</dt>
              <dd className="mt-1 break-all font-mono text-sm">{profile.id}</dd>
            </div>
          </dl>
        ) : !error ? <LoadingState label="Loading profile…" /> : null}
        <div className="mt-6">
          <Button variant="secondary" onClick={() => router.push('/reports')}>
            Go to reports
          </Button>
        </div>
      </Card>
    </div>
  );
}
