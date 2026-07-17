import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { ThemeToggle } from './ThemeToggle';

const setTheme = vi.fn();
let resolvedTheme = 'dark';

vi.mock('next-themes', () => ({
  useTheme: () => ({ resolvedTheme, setTheme }),
}));

describe('ThemeToggle', () => {
  beforeEach(() => {
    setTheme.mockClear();
    resolvedTheme = 'dark';
    document.head.innerHTML = '<meta name="theme-color" content="#f8fafc">';
  });

  test('switches away from the resolved theme', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole('button', { name: 'Toggle color theme' }));
    expect(setTheme).toHaveBeenCalledWith('light');
  });

  test('keeps mobile browser chrome aligned with the theme', async () => {
    render(<ThemeToggle />);

    await waitFor(() => {
      expect(document.querySelector('meta[name="theme-color"]')).toHaveAttribute(
        'content',
        '#020617',
      );
    });
  });
});
