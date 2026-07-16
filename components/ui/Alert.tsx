const tones = {
  error: 'border-rose-200 bg-rose-50 text-rose-800',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  info: 'border-sky-200 bg-sky-50 text-sky-800',
} as const;

type AlertProps = {
  tone?: keyof typeof tones;
  children: React.ReactNode;
};

export function Alert({ tone = 'info', children }: AlertProps) {
  return (
    <div className={['rounded-xl border px-4 py-3 text-sm', tones[tone]].join(' ')}>
      {children}
    </div>
  );
}
