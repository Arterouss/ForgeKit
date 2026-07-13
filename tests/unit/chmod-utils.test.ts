import { describe, it, expect } from 'vitest';
import {
  parseOctalToPermissions,
  permissionsToOctalString,
  permissionsToSymbolicString,
  permissionsToSymbolicClause,
  generateChmodCommand,
} from '@/lib/chmod-utils';

describe('chmod Calculator Pro Utilities (chmod-utils.ts)', () => {
  it('should parse octal 755 to correct permissions and convert back', () => {
    const perms = parseOctalToPermissions('755');
    expect(perms).not.toBeNull();
    expect(perms!.owner.read).toBe(true);
    expect(perms!.owner.write).toBe(true);
    expect(perms!.owner.execute).toBe(true);
    expect(perms!.group.write).toBe(false);

    expect(permissionsToOctalString(perms!)).toBe('755');
  });

  it('should handle special sticky bit 1777', () => {
    const perms = parseOctalToPermissions('1777');
    expect(perms).not.toBeNull();
    expect(perms!.special.sticky).toBe(true);
    expect(permissionsToOctalString(perms!)).toBe('1777');
  });

  it('should generate symbolic string and chmod command correctly', () => {
    const perms = parseOctalToPermissions('755')!;
    expect(permissionsToSymbolicString(perms)).toBe('-rwxr-xr-x');
    expect(permissionsToSymbolicClause(perms)).toBe('u=rwx,g=rx,o=rx');

    const cmd = generateChmodCommand({
      permissions: perms,
      targetPath: '/var/www/html',
      recursive: true,
      mode: 'octal',
    });

    expect(cmd).toBe('chmod -R 755 /var/www/html');
  });
});
