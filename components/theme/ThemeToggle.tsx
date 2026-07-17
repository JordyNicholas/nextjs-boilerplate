'use client';

import { useTheme } from 'next-themes';
import { useEffect, useSyncExternalStore } from 'react';
import { Button } from '@/components/ui/Button';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!resolvedTheme) return;

    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', resolvedTheme === 'dark' ? '#020617' : '#f8fafc');
  }, [resolvedTheme]);

  return (
    <Button
      variant="ghost"
      aria-label="Toggle color theme"
      title="Toggle color theme"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      {mounted && resolvedTheme === 'dark' ? 'Light' : 'Dark'}
    </Button>
  );
}
