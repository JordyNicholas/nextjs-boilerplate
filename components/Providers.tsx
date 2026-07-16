'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/lib/auth/AuthProvider';
import { TenantProvider } from '@/lib/tenant/TenantProvider';
import { AppShell } from '@/components/layout/AppShell';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TenantProvider>
        <AuthProvider>
          <AppShell>{children}</AppShell>
          <Toaster richColors position="bottom-right" />
        </AuthProvider>
      </TenantProvider>
    </ThemeProvider>
  );
}
