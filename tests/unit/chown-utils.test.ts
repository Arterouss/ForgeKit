import { describe, it, expect } from 'vitest';
import {
  generateOwnershipSpec,
  generateChownCommand,
  validateChownConfig,
  CHOWN_PRESETS,
} from '@/lib/chown-utils';

describe('chown Command Builder Utilities (chown-utils.ts)', () => {
  it('should generate www-data recursive chown command correctly', () => {
    const config = CHOWN_PRESETS[0].config;
    const cmd = generateChownCommand(config);

    expect(cmd).toContain('chown -R --preserve-root -c www-data:www-data /var/www/html');
  });

  it('should support reference file syntax', () => {
    const config = CHOWN_PRESETS[3].config;
    const spec = generateOwnershipSpec(config);

    expect(spec).toBe('--reference=/etc/nginx/nginx.conf');
    expect(generateChownCommand(config)).toContain('--reference=/etc/nginx/nginx.conf');
  });

  it('should invalidate missing owner and group when not using reference', () => {
    const res = validateChownConfig({
      owner: '',
      group: '',
      separator: ':',
      targetPaths: ['/test'],
      recursive: false,
      preserveRoot: true,
      noDereference: false,
      verboseMode: 'none',
      useReference: false,
    });

    expect(res.isValid).toBe(false);
  });
});
