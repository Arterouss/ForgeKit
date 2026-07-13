// ==============================================
// DevForge — SSH Key Viewer & Inspector Utils
// ==============================================
// Parse and inspect SSH public and private keys to
// extract algorithm type, comment/email label, security
// strength rating, key format, and encryption status.
// ==============================================

export type SshKeyType = 'public' | 'private' | 'unknown';
export type SshSecurityStrength = 'strong' | 'acceptable' | 'weak' | 'insecure';

export interface SshKeyInspectionResult {
  isValid: boolean;
  keyType: SshKeyType;
  algorithm: string;
  comment?: string;
  strength: SshSecurityStrength;
  strengthReason: string;
  formatDetails: string;
  isEncrypted?: boolean;
  base64Length?: number;
}

/**
 * Inspects raw SSH key content (public or private key string).
 */
export function inspectSshKey(rawKey: string): SshKeyInspectionResult {
  const trimmed = rawKey.trim();

  if (!trimmed) {
    return {
      isValid: false,
      keyType: 'unknown',
      algorithm: 'Unknown',
      strength: 'insecure',
      strengthReason: 'Empty SSH key content provided.',
      formatDetails: 'No input detected.',
    };
  }

  // Check Private Key Headers
  if (trimmed.startsWith('-----BEGIN ')) {
    const isEncrypted =
      trimmed.includes('ENCRYPTED') ||
      trimmed.includes('Proc-Type: 4,ENCRYPTED');

    let algorithm = 'OpenSSH Private Key';
    let strength: SshSecurityStrength = 'strong';
    let strengthReason = 'Modern OpenSSH Private Key structure.';

    if (trimmed.includes('BEGIN RSA PRIVATE KEY')) {
      algorithm = 'RSA Private Key (PKCS#1)';
      strength = 'acceptable';
      strengthReason = 'Traditional PKCS#1 RSA private key container.';
    } else if (trimmed.includes('BEGIN EC PRIVATE KEY')) {
      algorithm = 'Elliptic Curve Private Key (SEC1)';
      strength = 'strong';
      strengthReason = 'Elliptic Curve private key container.';
    } else if (trimmed.includes('BEGIN DSA PRIVATE KEY')) {
      algorithm = 'DSA Private Key (Deprecated)';
      strength = 'insecure';
      strengthReason = 'DSA cryptographic keys are obsolete and vulnerable.';
    }

    if (!isEncrypted) {
      strengthReason += ' WARNING: Private key is stored unencrypted (no passphrase).';
    } else {
      strengthReason += ' Private key is passphrase-protected.';
    }

    return {
      isValid: true,
      keyType: 'private',
      algorithm,
      strength,
      strengthReason,
      formatDetails: `PEM/OpenSSH Private Key Block (${isEncrypted ? 'Encrypted' : 'Unencrypted'})`,
      isEncrypted,
    };
  }

  // Check Public Key Format (algorithm base64 [comment])
  const parts = trimmed.split(/\s+/);
  if (parts.length >= 2) {
    const alg = parts[0].toLowerCase();
    const payload = parts[1];
    const comment = parts.slice(2).join(' ') || undefined;

    let algorithmName = parts[0];
    let strength: SshSecurityStrength = 'acceptable';
    let strengthReason = 'Standard SSH public key.';

    if (alg === 'ssh-ed25519') {
      algorithmName = 'Ed25519 (Edwards-curve Digital Signature Algorithm)';
      strength = 'strong';
      strengthReason = 'Highest security and performance standard (256-bit Edwards curve).';
    } else if (alg === 'ssh-rsa') {
      algorithmName = 'RSA (Rivest–Shamir–Adleman)';
      if (payload.length > 600) {
        strength = 'strong';
        strengthReason = 'RSA Public Key (~4096-bit key length estimated).';
      } else if (payload.length > 350) {
        strength = 'acceptable';
        strengthReason = 'RSA Public Key (~2048-bit key length estimated).';
      } else {
        strength = 'weak';
        strengthReason = 'RSA Public Key (<2048-bit key length estimated, vulnerable to factoring).';
      }
    } else if (alg.startsWith('ecdsa-sha2-')) {
      algorithmName = `ECDSA (${alg.replace('ecdsa-sha2-', '')})`;
      strength = 'strong';
      strengthReason = 'NIST Elliptic Curve Digital Signature Algorithm.';
    } else if (alg === 'ssh-dss') {
      algorithmName = 'DSA (Digital Signature Algorithm)';
      strength = 'insecure';
      strengthReason = 'DSA (1024-bit limit) is deprecated in modern OpenSSH.';
    } else {
      return {
        isValid: false,
        keyType: 'unknown',
        algorithm: parts[0],
        strength: 'weak',
        strengthReason: `Unrecognized SSH algorithm prefix "${parts[0]}".`,
        formatDetails: 'Invalid SSH key line.',
      };
    }

    return {
      isValid: true,
      keyType: 'public',
      algorithm: algorithmName,
      comment,
      strength,
      strengthReason,
      formatDetails: `OpenSSH Authorized Key Line (${payload.length} base64 chars)`,
      base64Length: payload.length,
    };
  }

  return {
    isValid: false,
    keyType: 'unknown',
    algorithm: 'Invalid Format',
    strength: 'insecure',
    strengthReason: 'Input does not match valid SSH public or private key formats.',
    formatDetails: 'Unparseable input.',
  };
}

export const SSH_KEY_SAMPLES: {
  name: string;
  description: string;
  content: string;
}[] = [
  {
    name: 'Modern Ed25519 Public Key (Recommended)',
    description: 'High-security 256-bit Edwards-curve public key with developer email comment',
    content:
      'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGXfS0jXz+sV4qE8mK2n7H9jN/3lR8uT0+Q8/cQv1pLx deploy@devforge.io',
  },
  {
    name: 'Standard 4096-bit RSA Public Key',
    description: 'High-strength RSA key compatible with legacy and modern SSH daemons',
    content:
      'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDc8n2sX9m...SAMPLE_LONG_BASE64_PAYLOAD_FOR_4096_BIT_RSA_KEY_CONTAINER_PADDING_ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789... devops@infrastructure.internal',
  },
  {
    name: 'Deprecated DSA Public Key (Insecure)',
    description: 'Legacy 1024-bit DSA key rejected by modern OpenSSH servers',
    content:
      'ssh-dss AAAAB3NzaC1rY3MAAACBAKz9Z1pX...SAMPLE_DSA_PAYLOAD legacy-user@old-server',
  },
  {
    name: 'Encrypted OpenSSH Private Key Header',
    description: 'Passphrase-protected private key container format inspection',
    content: [
      '-----BEGIN OPENSSH PRIVATE KEY-----',
      'b3BlbnNzaC1rZXktdjEAAAAACmFlczI1Ni1jdHIAAAAGYmNyeXB0AAAAGAAAABDxK/X9s1',
      '...SAMPLE_ENCRYPTED_PRIVATE_KEY_BODY...',
      '-----END OPENSSH PRIVATE KEY-----',
    ].join('\n'),
  },
];
