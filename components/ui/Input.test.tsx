import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  test('associates its label with the input', () => {
    render(<Input label="Email address" type="email" />);

    expect(screen.getByRole('textbox', { name: 'Email address' })).toHaveAttribute(
      'id',
      'email-address',
    );
  });

  test('renders an accessible validation message', () => {
    render(<Input label="Name" error="Name is required" />);

    expect(screen.getByText('Name is required')).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveAccessibleDescription(
      'Name is required',
    );
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });
});
