import { describe, it, expect } from 'vitest';
import {
  generateNginxConfig,
  validateNginxConfig,
  NGINX_PRESETS,
} from '@/lib/nginx-utils';

describe('Nginx Config Utilities (nginx-utils.ts)', () => {
  it('should generate reverse proxy Nginx configuration', () => {
    const preset = NGINX_PRESETS[0].options;
    const config = generateNginxConfig(preset);

    expect(config).toContain('server_name app.devforge.io;');
    expect(config).toContain('proxy_pass http://localhost:3000;');
    expect(config).toContain('gzip on;');
  });

  it('should validate missing proxy_pass in reverse proxy mode', () => {
    const res = validateNginxConfig({
      mode: 'reverse_proxy',
      serverName: 'example.com',
      listenPort: 80,
      sslEnabled: false,
      proxyPassUrl: '',
      gzipEnabled: false,
      securityHeadersEnabled: false,
      clientMaxBodySize: '10M',
    });

    expect(res.isValid).toBe(false);
    expect(res.errors[0]).toContain('proxy_pass');
  });
});
