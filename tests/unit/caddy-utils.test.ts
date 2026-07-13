import { describe, it, expect } from 'vitest';
import {
  generateCaddyfile,
  validateCaddyConfig,
  CADDY_PRESETS,
} from '@/lib/caddy-utils';

describe('Caddy Config Builder Utilities (caddy-utils.ts)', () => {
  it('should generate automatic HTTPS reverse proxy Caddyfile correctly', () => {
    const config = CADDY_PRESETS[0].config;
    const output = generateCaddyfile(config);

    expect(output).toContain('email admin@devforge.io');
    expect(output).toContain('app.devforge.io {');
    expect(output).toContain('encode gzip zstd');
    expect(output).toContain('reverse_proxy 127.0.0.1:3000');
  });

  it('should generate SPA file server block correctly', () => {
    const config = CADDY_PRESETS[1].config;
    const output = generateCaddyfile(config);

    expect(output).toContain('root * /var/www/frontend/dist');
    expect(output).toContain('file_server');
    expect(output).toContain('try_files {path} /index.html');
  });

  it('should invalidate empty domain', () => {
    const res = validateCaddyConfig({
      ...CADDY_PRESETS[0].config,
      domain: '',
    });

    expect(res.isValid).toBe(false);
  });
});
