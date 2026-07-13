import { describe, it, expect } from 'vitest';
import {
  generateApacheConfig,
  validateApacheConfig,
  APACHE_PRESETS,
} from '@/lib/apache-utils';

describe('Apache Virtual Host Builder Utilities (apache-utils.ts)', () => {
  it('should generate SSL VirtualHost with HTTP redirect correctly', () => {
    const config = APACHE_PRESETS[0].config;
    const output = generateApacheConfig(config);

    expect(output).toContain('<VirtualHost *:80>');
    expect(output).toContain('Redirect permanent / https://app.devforge.io/');
    expect(output).toContain('<VirtualHost *:443>');
    expect(output).toContain('SSLEngine on');
    expect(output).toContain('AllowOverride All');
  });

  it('should generate Reverse Proxy block correctly', () => {
    const config = APACHE_PRESETS[1].config;
    const output = generateApacheConfig(config);

    expect(output).toContain('ProxyPreserveHost On');
    expect(output).toContain('ProxyPass / http://127.0.0.1:3000/');
  });

  it('should require SSL certificates when SSL is enabled', () => {
    const res = validateApacheConfig({
      ...APACHE_PRESETS[0].config,
      sslCertFile: '',
    });

    expect(res.isValid).toBe(false);
  });
});
