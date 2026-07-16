import { type ReactNode } from 'react';

type CardProps = {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function Card({ title, description, children, className = '' }: CardProps) {
  return (
    <section
      className={[
        'rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900',
        className,
      ].join(' ')}
    >
      {title ? (
        <header className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
          ) : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}
