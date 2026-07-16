'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useTenant } from '@/lib/tenant/TenantProvider';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { toast } from 'sonner';

const links = [
  { href: '/', label: 'Status' },
  { href: '/login', label: 'Login' },
  { href: '/register', label: 'Register' },
  { href: '/profile', label: 'Profile' },
  { href: '/reports', label: 'Reports' },
];

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={[
        'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        active
          ? 'bg-teal-700 text-white dark:bg-teal-600'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
      ].join(' ')}
    >
      {label}
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout } = useAuth();
  const { tenantId, setTenantId } = useTenant();

  return (
    <div className="min-h-full bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] dark:bg-[linear-gradient(180deg,#020617_0%,#0f172a_100%)]">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-400">
              TS Monolith
            </p>
            <h1 className="text-base font-semibold text-slate-900 sm:text-lg dark:text-slate-100">
              API Console
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            {isAuthenticated ? (
              <Button
                variant="ghost"
                onClick={() => {
                  void logout().then(() => toast.success('Signed out'));
                }}
              >
                Logout
              </Button>
            ) : null}
          </div>
        </div>
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 pb-2 sm:px-6">
          <label
            htmlFor="tenant-switcher"
            className="shrink-0 text-xs font-medium text-slate-500 dark:text-slate-400"
          >
            Tenant
          </label>
          <input
            id="tenant-switcher"
            value={tenantId}
            onChange={(event) => setTenantId(event.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-mono text-xs text-slate-700 outline-none focus:border-teal-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          />
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-3 sm:px-6">
          {links.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
    </div>
  );
}
