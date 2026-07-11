'use client';

import { useEffect } from 'react';

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error('[DevForge] Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-danger-muted)]">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-danger)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <div>
        <h2 className="mb-2 text-xl font-semibold text-[var(--color-text-primary)]">
          Something went wrong
        </h2>
        <p className="max-w-md text-sm text-[var(--color-text-secondary)]">
          An unexpected error occurred. Please try again or contact support if
          the problem persists.
        </p>
      </div>
      <button
        onClick={() => unstable_retry()}
        className="rounded-[var(--radius-sm)] bg-[var(--color-primary)] px-6 py-2.5 text-sm font-medium text-[var(--color-bg)] transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)]"
      >
        Try again
      </button>
    </div>
  );
}
