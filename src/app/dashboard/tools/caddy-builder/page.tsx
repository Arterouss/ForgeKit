import type { Metadata } from 'next';
import { CaddyBuilderPro } from '@/components/tools/caddy-builder';

export const metadata: Metadata = {
  title: 'Caddy Config Builder — DevForge Developer Studio',
  description:
    'Visual Caddyfile generator for Caddy v2 with automatic Let\'s Encrypt HTTPS, reverse proxy routing, static file SPA servers, gzip/zstd compression, and security headers.',
};

export default function CaddyBuilderPage() {
  return (
      <div className="flex flex-1 flex-col p-6">
        <CaddyBuilderPro />
      </div>
  );
}
