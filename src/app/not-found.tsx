import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="text-7xl font-bold text-[var(--color-text-muted)]">
        404
      </div>
      <div>
        <h2 className="mb-2 text-xl font-semibold text-[var(--color-text-primary)]">
          Page not found
        </h2>
        <p className="max-w-md text-sm text-[var(--color-text-secondary)]">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <Link
        href="/"
        className="rounded-[var(--radius-sm)] bg-[var(--color-primary)] px-6 py-2.5 text-sm font-medium text-[var(--color-bg)] transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)]"
      >
        Go home
      </Link>
    </div>
  );
}
