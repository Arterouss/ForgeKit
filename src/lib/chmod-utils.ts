// ==============================================
// DevForge — chmod Calculator Pro Utils
// ==============================================
// Bidirectional conversion between Linux octal,
// symbolic permission strings, and individual bit flags
// with CLI chmod command generation.
// ==============================================

export interface PermissionEntityBits {
  read: boolean;
  write: boolean;
  execute: boolean;
}

export interface ChmodPermissions {
  owner: PermissionEntityBits;
  group: PermissionEntityBits;
  others: PermissionEntityBits;
  special: {
    setuid: boolean;
    setgid: boolean;
    sticky: boolean;
  };
}

export interface ChmodCommandConfig {
  permissions: ChmodPermissions;
  targetPath: string;
  recursive: boolean;
  mode: 'octal' | 'symbolic';
}

/**
 * Converts a permission bits object to a single octal digit (0-7).
 */
export function entityBitsToOctalDigit(bits: PermissionEntityBits): number {
  let val = 0;
  if (bits.read) val += 4;
  if (bits.write) val += 2;
  if (bits.execute) val += 1;
  return val;
}

/**
 * Converts a single octal digit (0-7) to permission bits.
 */
export function octalDigitToEntityBits(digit: number): PermissionEntityBits {
  return {
    read: (digit & 4) !== 0,
    write: (digit & 2) !== 0,
    execute: (digit & 1) !== 0,
  };
}

/**
 * Calculates full octal string representation (3 or 4 digits).
 */
export function permissionsToOctalString(
  permissions: ChmodPermissions
): string {
  const o = entityBitsToOctalDigit(permissions.owner);
  const g = entityBitsToOctalDigit(permissions.group);
  const ot = entityBitsToOctalDigit(permissions.others);

  let sp = 0;
  if (permissions.special.setuid) sp += 4;
  if (permissions.special.setgid) sp += 2;
  if (permissions.special.sticky) sp += 1;

  if (sp > 0) {
    return `${sp}${o}${g}${ot}`;
  }
  return `${o}${g}${ot}`;
}

/**
 * Parses an octal permission string (e.g. "755" or "0755" or "1777") to ChmodPermissions.
 */
export function parseOctalToPermissions(
  octalStr: string
): ChmodPermissions | null {
  const clean = octalStr.trim().replace(/^0+([0-7]{3})$/, '$1');
  if (!/^[0-7]{3,4}$/.test(clean)) return null;

  let spDigit = 0;
  let oDigit = 0;
  let gDigit = 0;
  let otDigit = 0;

  if (clean.length === 4) {
    spDigit = parseInt(clean[0], 10);
    oDigit = parseInt(clean[1], 10);
    gDigit = parseInt(clean[2], 10);
    otDigit = parseInt(clean[3], 10);
  } else {
    oDigit = parseInt(clean[0], 10);
    gDigit = parseInt(clean[1], 10);
    otDigit = parseInt(clean[2], 10);
  }

  return {
    owner: octalDigitToEntityBits(oDigit),
    group: octalDigitToEntityBits(gDigit),
    others: octalDigitToEntityBits(otDigit),
    special: {
      setuid: (spDigit & 4) !== 0,
      setgid: (spDigit & 2) !== 0,
      sticky: (spDigit & 1) !== 0,
    },
  };
}

/**
 * Converts permissions to 10-character symbolic string (e.g. "-rwxr-xr-x").
 */
export function permissionsToSymbolicString(
  permissions: ChmodPermissions
): string {
  const o = permissions.owner;
  const g = permissions.group;
  const ot = permissions.others;
  const sp = permissions.special;

  let oExec = '-';
  if (sp.setuid) {
    oExec = o.execute ? 's' : 'S';
  } else if (o.execute) {
    oExec = 'x';
  }

  let gExec = '-';
  if (sp.setgid) {
    gExec = g.execute ? 's' : 'S';
  } else if (g.execute) {
    gExec = 'x';
  }

  let otExec = '-';
  if (sp.sticky) {
    otExec = ot.execute ? 't' : 'T';
  } else if (ot.execute) {
    otExec = 'x';
  }

  return (
    '-' +
    (o.read ? 'r' : '-') +
    (o.write ? 'w' : '-') +
    oExec +
    (g.read ? 'r' : '-') +
    (g.write ? 'w' : '-') +
    gExec +
    (ot.read ? 'r' : '-') +
    (ot.write ? 'w' : '-') +
    otExec
  );
}

/**
 * Generates the symbolic chmod mode string (e.g. "u=rwx,g=rx,o=rx").
 */
export function permissionsToSymbolicClause(
  permissions: ChmodPermissions
): string {
  const toClause = (bits: PermissionEntityBits) =>
    (bits.read ? 'r' : '') +
    (bits.write ? 'w' : '') +
    (bits.execute ? 'x' : '');

  const u = toClause(permissions.owner);
  const g = toClause(permissions.group);
  const o = toClause(permissions.others);

  return `u=${u},g=${g},o=${o}`;
}

/**
 * Generates the full `chmod` CLI command.
 */
export function generateChmodCommand(config: ChmodCommandConfig): string {
  const flags = config.recursive ? '-R ' : '';
  const modeStr =
    config.mode === 'octal'
      ? permissionsToOctalString(config.permissions)
      : permissionsToSymbolicClause(config.permissions);

  const target = config.targetPath.trim() || 'filename';
  return `chmod ${flags}${modeStr} ${target}`;
}

export const CHMOD_PRESETS: {
  name: string;
  octal: string;
  description: string;
}[] = [
  {
    name: 'Standard Executable / Directory (755)',
    octal: '755',
    description: 'Owner can read, write, execute; Group/Others can read & execute',
  },
  {
    name: 'Standard File (644)',
    octal: '644',
    description: 'Owner can read & write; Group/Others can only read',
  },
  {
    name: 'Private Secure File / Key (600)',
    octal: '600',
    description: 'Owner can read & write; nobody else has access (required for ~/.ssh/id_ed25519)',
  },
  {
    name: 'Private Directory (700)',
    octal: '700',
    description: 'Owner can read, write & execute; nobody else has access (required for ~/.ssh)',
  },
  {
    name: 'Web Server Writable Directory (775)',
    octal: '775',
    description: 'Owner & Group can read, write & execute; Others can read & execute',
  },
  {
    name: 'Shared Temp Sticky Directory (1777)',
    octal: '1777',
    description: 'Full read/write/execute for everyone, but only file owner can delete their files',
  },
];
