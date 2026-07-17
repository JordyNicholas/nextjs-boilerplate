import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  test('provides a touch-friendly target and handles activation', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={onClick}>Save</Button>);

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveClass('min-h-11');

    await user.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  test('applies full-width styling when requested', () => {
    render(<Button fullWidth>Continue</Button>);

    expect(screen.getByRole('button', { name: 'Continue' })).toHaveClass('w-full');
  });
});
