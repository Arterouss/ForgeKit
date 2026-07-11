// ==============================================
// DevForge — Prisma Client (Prepared)
// ==============================================
// Singleton pattern to prevent multiple instances
// during development hot reloads.
//
// NOTE: Uncomment when Prisma is configured and
// `prisma generate` has been run.
// ==============================================

// import { PrismaClient } from '@prisma/client';
//
// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined;
// };
//
// export const db = globalForPrisma.prisma ?? new PrismaClient();
//
// if (process.env.NODE_ENV !== 'production') {
//   globalForPrisma.prisma = db;
// }

/**
 * Placeholder export until Prisma is configured.
 * Run `pnpm db:generate` after setting up DATABASE_URL.
 */
export const db = null;
