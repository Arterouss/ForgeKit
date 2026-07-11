// ==============================================
// DevForge — Better Auth Configuration (Prepared)
// ==============================================
// Architecture skeleton only. Not implemented yet.
// ==============================================

/**
 * Better Auth configuration placeholder.
 *
 * When auth is enabled, this module will export the
 * configured Better Auth instance. For now, it only
 * defines the expected interface shape.
 */

export interface AuthConfig {
  secret: string;
  url: string;
  database: {
    provider: 'postgresql';
    url: string;
  };
}

/**
 * Placeholder — returns null until auth is implemented.
 */
export function getAuthConfig(): AuthConfig | null {
  const enabled = process.env.NEXT_PUBLIC_ENABLE_AUTH === 'true';
  if (!enabled) return null;

  return {
    secret: process.env.BETTER_AUTH_SECRET ?? '',
    url: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
    database: {
      provider: 'postgresql',
      url: process.env.DATABASE_URL ?? '',
    },
  };
}
