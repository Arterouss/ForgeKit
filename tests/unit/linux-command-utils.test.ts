import { describe, it, expect } from 'vitest';
import {
  filterLinuxCommands,
  LINUX_COMMAND_DATABASE,
} from '@/lib/linux-command-utils';

describe('Linux Command Explorer Utilities (linux-command-utils.ts)', () => {
  it('should return all commands when no filter applied', () => {
    const results = filterLinuxCommands('', 'all');
    expect(results.length).toBe(LINUX_COMMAND_DATABASE.length);
  });

  it('should filter by category correctly', () => {
    const results = filterLinuxCommands('', 'system_processes');
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((r) => r.category === 'system_processes')).toBe(true);
  });

  it('should filter by keyword query', () => {
    const results = filterLinuxCommands('tar', 'all');
    expect(results.some((r) => r.id === 'tar-archive')).toBe(true);
  });
});
