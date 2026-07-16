'use client';

import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';
import { Button } from '@/components/ui/Button';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

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
