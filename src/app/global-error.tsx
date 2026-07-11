'use client';

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  console.error('[DevForge] Global error:', error);

  return (
    <html lang="en">
      <body
        style={{
          backgroundColor: '#0f1115',
          color: '#f5f7fa',
          fontFamily: 'system-ui, sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          margin: 0,
          padding: '1rem',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              marginBottom: '0.5rem',
            }}
          >
            Something went wrong
          </h2>
          <p
            style={{
              fontSize: '0.875rem',
              color: '#aeb8c5',
              marginBottom: '1.5rem',
            }}
          >
            A critical error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={() => unstable_retry()}
            style={{
              backgroundColor: '#00e5ff',
              color: '#0f1115',
              border: 'none',
              borderRadius: '12px',
              padding: '0.625rem 1.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
