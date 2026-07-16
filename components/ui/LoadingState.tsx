export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex min-h-32 items-center justify-center gap-3 text-sm text-slate-500 dark:text-slate-400">
      <span className="size-5 animate-spin rounded-full border-2 border-slate-300 border-t-teal-700 dark:border-slate-700 dark:border-t-teal-400" />
      <span>{label}</span>
    </div>
  );
}
