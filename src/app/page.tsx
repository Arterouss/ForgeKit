export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--color-primary-muted)]">
        <span className="text-4xl">⚒️</span>
      </div>
      <h1
        className="text-center text-4xl font-bold tracking-tight"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        <span className="text-[var(--color-primary)]">Dev</span>Forge
      </h1>
      <p className="max-w-md text-center text-[var(--color-text-secondary)]">
        The ultimate all-in-one toolbox for software developers.
        <br />
        Sprint v0.1 — Infrastructure ready.
      </p>
    </main>
  );
}
