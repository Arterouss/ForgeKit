import { describe, it, expect } from 'vitest';
import {
  generateDnsCommands,
  simulateDnsLookup,
  auditDnsSecurity,
} from '@/lib/dns-lookup-utils';

describe('DNS Lookup Tool Utilities (dns-lookup-utils.ts)', () => {
  it('should generate dig command with nameserver correctly', () => {
    const commands = generateDnsCommands({
      domain: 'devforge.io',
      recordType: 'A',
      nameserver: '1.1.1.1',
    });

    expect(commands.dig).toContain('dig +nocmd devforge.io A @1.1.1.1');
    expect(commands.nslookup).toContain('nslookup -type=A devforge.io 1.1.1.1');
  });

  it('should simulate DNS lookup filtering by record type', () => {
    const mxRecords = simulateDnsLookup('devforge.io', 'MX');

    expect(mxRecords.length).toBeGreaterThan(0);
    expect(mxRecords.every((r) => r.type === 'MX')).toBe(true);
  });

  it('should audit SPF and DMARC passing on all simulated records', () => {
    const allRecords = simulateDnsLookup('devforge.io', 'ALL');
    const health = auditDnsSecurity(allRecords);

    expect(health.some((h) => h.status === 'pass' && h.category.includes('SPF'))).toBe(
      true
    );
  });
});
