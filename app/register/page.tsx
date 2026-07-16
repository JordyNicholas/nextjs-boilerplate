'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ApiClientError } from '@/lib/api/client';
import { register } from '@/lib/api/users';
import { useTenant } from '@/lib/tenant/TenantProvider';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

export default function RegisterPage() {
  const router = useRouter();
  const { tenantId } = useTenant();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const user = await register({ name, email, password }, tenantId);
      setSuccess(`Account created for ${user.email}. You can sign in now.`);
      toast.success('Account created');
      setTimeout(() => router.push('/login'), 1200);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <Card
        title="POST /users/"
        description="Register a user for the default tenant (x-tenant-id header)."
      >
        <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-4">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
          {error ? <Alert tone="error">{error}</Alert> : null}
          {success ? <Alert tone="success">{success}</Alert> : null}
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
