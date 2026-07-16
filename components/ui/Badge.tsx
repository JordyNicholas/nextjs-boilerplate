const styles = {
  ok: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  warn: 'bg-amber-50 text-amber-800 ring-amber-200',
  error: 'bg-rose-50 text-rose-800 ring-rose-200',
  neutral: 'bg-slate-100 text-slate-700 ring-slate-200',
  info: 'bg-sky-50 text-sky-800 ring-sky-200',
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
