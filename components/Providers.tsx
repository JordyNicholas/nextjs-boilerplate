'use client';

import { AuthProvider } from '@/lib/auth/AuthProvider';
import { AppShell } from '@/components/layout/AppShell';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppShell>{children}</AppShell>
    </AuthProvider>
  );
}
