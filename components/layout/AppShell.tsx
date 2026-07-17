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

function NavLink({
  href,
  label,
  mobile = false,
}: {
  href: string;
  label: string;
  mobile?: boolean;
}) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={[
        mobile
          ? 'flex min-h-14 min-w-0 flex-1 items-center justify-center px-1 py-2 text-[11px] font-semibold transition-colors'
          : 'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        active
          ? mobile
            ? 'border-t-2 border-teal-600 bg-teal-50 text-teal-800 dark:border-teal-400 dark:bg-slate-900 dark:text-teal-300'
            : 'bg-teal-700 text-white dark:bg-teal-600'
          : mobile
            ? 'border-t-2 border-transparent text-slate-600 active:bg-slate-100 dark:text-slate-300 dark:active:bg-slate-800'
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
    <div className="min-h-dvh bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] dark:bg-[linear-gradient(180deg,#020617_0%,#0f172a_100%)]">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 pt-[env(safe-area-inset-top)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
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
            className="min-h-11 min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-mono text-base text-slate-700 outline-none focus:border-teal-600 sm:min-h-0 sm:text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          />
        </div>
        <nav
          aria-label="Primary navigation"
          className="mx-auto hidden max-w-6xl gap-1 px-4 pb-3 sm:flex sm:px-6"
        >
          {links.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 pt-5 pb-[calc(5rem+env(safe-area-inset-bottom))] sm:px-6 sm:py-8">
        {children}
      </main>
      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-30 flex border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur sm:hidden dark:border-slate-800 dark:bg-slate-950/95"
      >
        {links.map((link) => (
          <NavLink key={link.href} {...link} mobile />
        ))}
      </nav>
    </div>
  );
}
