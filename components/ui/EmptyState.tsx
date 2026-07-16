import type { ReactNode } from 'react';

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 px-5 py-10 text-center dark:border-slate-700">
      <h3 className="font-medium text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
