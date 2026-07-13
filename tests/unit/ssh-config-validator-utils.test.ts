import { describe, it, expect } from 'vitest';
import {
  inspectSshConfig,
  SSH_CONFIG_SAMPLES,
} from '@/lib/ssh-config-validator-utils';

describe('SSH Config Validator Utilities (ssh-config-validator-utils.ts)', () => {
  it('should detect duplicate alias and missing HostName in buggy sample', () => {
    const buggy = SSH_CONFIG_SAMPLES[0].content;
    const res = inspectSshConfig(buggy);

    expect(res.isValid).toBe(false);
    expect(res.score).toBeLessThan(100);
    expect(res.diagnostics.some((d) => d.title === 'Duplicate Host Alias')).toBe(true);
    expect(res.diagnostics.some((d) => d.title === 'Missing HostName Directive')).toBe(true);
  });

  it('should validate clean sample with 100 quality score', () => {
    const clean = SSH_CONFIG_SAMPLES[1].content;
    const res = inspectSshConfig(clean);

    expect(res.isValid).toBe(true);
    expect(res.parsedHostCount).toBe(2);
    expect(res.diagnostics.filter((d) => d.severity === 'error').length).toBe(0);
  });
});
