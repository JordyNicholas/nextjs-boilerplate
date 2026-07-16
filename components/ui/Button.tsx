import { type ButtonHTMLAttributes } from 'react';

const variants = {
  primary:
    'bg-teal-700 text-white hover:bg-teal-800 focus-visible:ring-teal-600 disabled:bg-teal-400 dark:bg-teal-600 dark:hover:bg-teal-500',
  secondary:
    'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 focus-visible:ring-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500',
  ghost:
    'text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-300 dark:text-slate-300 dark:hover:bg-slate-800',
} as const;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  fullWidth?: boolean;
};

export function Button({
  variant = 'primary',
  fullWidth,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-70',
        variants[variant],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
