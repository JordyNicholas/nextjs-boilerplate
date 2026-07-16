const styles = {
  ok: 'bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:ring-emerald-900',
  warn:
    'bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:ring-amber-900',
  error:
    'bg-rose-50 text-rose-800 ring-rose-200 dark:bg-rose-950 dark:text-rose-200 dark:ring-rose-900',
  neutral:
    'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700',
  info: 'bg-sky-50 text-sky-800 ring-sky-200 dark:bg-sky-950 dark:text-sky-200 dark:ring-sky-900',
} as const;

type BadgeProps = {
  tone?: keyof typeof styles;
  children: React.ReactNode;
};

export function Badge({ tone = 'neutral', children }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        styles[tone],
      ].join(' ')}
    >
      {children}
    </span>
  );
}
