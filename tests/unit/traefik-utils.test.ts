import { describe, it, expect } from 'vitest';
import {
  generateTraefikConfig,
  validateTraefikConfig,
  TRAEFIK_PRESETS,
} from '@/lib/traefik-utils';

describe('Traefik Config Utilities (traefik-utils.ts)', () => {
  it('should generate valid Traefik static and dynamic YAML', () => {
    const preset = TRAEFIK_PRESETS[0].options;
    const yaml = generateTraefikConfig(preset);

    expect(yaml).toContain('entryPoints:');
    expect(yaml).toContain('certificatesResolvers:');
    expect(yaml).toContain('Host(`app.devforge.io`)');
  });

  it('should fail validation if Let\'s Encrypt enabled without valid ACME email', () => {
    const res = validateTraefikConfig({
      apiDashboardEnabled: false,
      dockerProviderEnabled: false,
      httpPort: 80,
      httpsPort: 443,
      letsEncryptEnabled: true,
      acmeEmail: 'invalidemail',
      routers: [],
    });

    expect(res.isValid).toBe(false);
    expect(res.errors[0]).toContain('email address');
  });
});
