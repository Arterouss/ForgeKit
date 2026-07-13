import type { MetadataRoute } from 'next';
import { initializeRegistry } from '@/sdk/tools-init';
import { getAllTools } from '@/sdk/tool-registry';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://devforge.dev';

  // Ensure registry is initialized
  initializeRegistry();
  const tools = getAllTools();

  const coreRoutes = [
    '',
    '/dashboard',
    '/dashboard/workspace',
    '/dashboard/marketplace',
    '/dashboard/pinned',
    '/dashboard/recent',
    '/dashboard/collections',
    '/dashboard/notes',
    '/dashboard/snippets',
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.9,
  }));

  const toolRoutes = tools.map((tool) => ({
    url: `${baseUrl}/dashboard/tools/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...coreRoutes, ...toolRoutes];
}
