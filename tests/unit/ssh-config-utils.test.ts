import { describe, it, expect } from 'vitest';
import {
  generateSshConfig,
  validateSshConfig,
  SSH_PRESETS,
} from '@/lib/ssh-config-utils';

describe('SSH Config Builder Utilities (ssh-config-utils.ts)', () => {
  it('should generate bastion ProxyJump architecture correctly', () => {
    const doc = SSH_PRESETS[0].document;
    const config = generateSshConfig(doc);

    expect(config).toContain('Host *');
    expect(config).toContain('Host bastion');
    expect(config).toContain('HostName bastion.infra.devforge.io');
    expect(config).toContain('ProxyJump bastion');
    expect(config).toContain('LocalForward 5432 localhost:5432');
  });

  it('should detect duplicate Host aliases', () => {
    const res = validateSshConfig({
      includeGlobalDefaults: false,
      globalServerAliveInterval: 60,
      hosts: [
        {
          id: '1',
          hostAlias: 'myserver',
          hostname: '1.2.3.4',
          user: 'root',
          forwardAgent: false,
        },
        {
          id: '2',
          hostAlias: 'myserver',
          hostname: '5.6.7.8',
          user: 'root',
          forwardAgent: false,
        },
      ],
    });

    expect(res.isValid).toBe(false);
    expect(res.errors.some((e) => e.includes('Duplicate Host alias'))).toBe(true);
  });
});
