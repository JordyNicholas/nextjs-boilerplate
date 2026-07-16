'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthProvider';
import { Button } from '@/components/ui/Button';

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
        active ? 'bg-teal-700 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
      ].join(' ')}
    >
      {label}
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-full bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)]">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
              TS Monolith
            </p>
            <h1 className="text-base font-semibold text-slate-900 sm:text-lg">API Console</h1>
          </div>
          {isAuthenticated ? (
            <Button variant="ghost" onClick={() => void logout()}>
              Logout
            </Button>
          ) : null}
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
