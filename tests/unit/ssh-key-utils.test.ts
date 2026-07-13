import { describe, it, expect } from 'vitest';
import {
  inspectSshKey,
  SSH_KEY_SAMPLES,
} from '@/lib/ssh-key-utils';

describe('SSH Key Viewer Utilities (ssh-key-utils.ts)', () => {
  it('should inspect Ed25519 public key correctly', () => {
    const res = inspectSshKey(SSH_KEY_SAMPLES[0].content);

    expect(res.isValid).toBe(true);
    expect(res.keyType).toBe('public');
    expect(res.strength).toBe('strong');
    expect(res.comment).toBe('deploy@devforge.io');
  });

  it('should flag deprecated DSA public key as insecure', () => {
    const res = inspectSshKey(SSH_KEY_SAMPLES[2].content);

    expect(res.isValid).toBe(true);
    expect(res.keyType).toBe('public');
    expect(res.strength).toBe('insecure');
  });

  it('should identify private key container', () => {
    const res = inspectSshKey(SSH_KEY_SAMPLES[3].content);

    expect(res.isValid).toBe(true);
    expect(res.keyType).toBe('private');
    expect(res.algorithm).toBe('OpenSSH Private Key');
  });
});
