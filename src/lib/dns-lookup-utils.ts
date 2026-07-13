// ==============================================
// DevForge — DNS Lookup Tool Utils
// ==============================================
// Generate DNS query commands (dig, nslookup, host),
// simulate record queries (A, AAAA, MX, TXT, NS, CAA),
// and inspect email security records (SPF, DMARC).
// ==============================================

export type DnsRecordType =
  | 'A'
  | 'AAAA'
  | 'CNAME'
  | 'MX'
  | 'TXT'
  | 'NS'
  | 'SOA'
  | 'CAA'
  | 'ALL';

export interface DnsRecordEntry {
  type: DnsRecordType;
  name: string;
  ttl: number;
  value: string;
  priority?: number;
}

export interface DnsLookupConfig {
  domain: string;
  recordType: DnsRecordType;
  nameserver: string;
}

export interface DnsCommandSnippets {
  dig: string;
  nslookup: string;
  host: string;
}

export interface DnsHealthCheck {
  category: string;
  status: 'pass' | 'warn' | 'fail';
  summary: string;
  details: string;
}

/**
 * Generate CLI DNS commands for dig, nslookup, and host.
 */
export function generateDnsCommands(config: DnsLookupConfig): DnsCommandSnippets {
  const domain = config.domain.trim() || 'devforge.io';
  const type = config.recordType === 'ALL' ? 'ANY' : config.recordType;
  const nsArgDig = config.nameserver.trim() ? ` @${config.nameserver.trim()}` : '';
  const nsArgNslookup = config.nameserver.trim() ? ` ${config.nameserver.trim()}` : '';

  return {
    dig: `dig +nocmd ${domain} ${type}${nsArgDig} +noall +answer`,
    nslookup: `nslookup -type=${type} ${domain}${nsArgNslookup}`,
    host: `host -t ${type} ${domain}${nsArgNslookup}`,
  };
}

/**
 * Simulate DNS record resolution for live testing & preview.
 */
export function simulateDnsLookup(
  domainInput: string,
  recordType: DnsRecordType
): DnsRecordEntry[] {
  const domain = (domainInput.trim() || 'devforge.io').toLowerCase();

  const allMockRecords: DnsRecordEntry[] = [
    {
      type: 'A',
      name: domain,
      ttl: 300,
      value: '104.21.84.192',
    },
    {
      type: 'A',
      name: domain,
      ttl: 300,
      value: '172.67.142.88',
    },
    {
      type: 'AAAA',
      name: domain,
      ttl: 300,
      value: '2606:4700:3036::6815:54c0',
    },
    {
      type: 'MX',
      name: domain,
      ttl: 3600,
      priority: 10,
      value: 'inbound-smtp.us-east-1.amazonaws.com.',
    },
    {
      type: 'MX',
      name: domain,
      ttl: 3600,
      priority: 20,
      value: 'inbound-smtp.us-west-2.amazonaws.com.',
    },
    {
      type: 'TXT',
      name: domain,
      ttl: 3600,
      value: '"v=spf1 include:amazonses.com include:_spf.google.com ~all"',
    },
    {
      type: 'TXT',
      name: `_dmarc.${domain}`,
      ttl: 3600,
      value: '"v=DMARC1; p=reject; rua=mailto:dmarc-reports@devforge.io"',
    },
    {
      type: 'NS',
      name: domain,
      ttl: 86400,
      value: 'ns1.cloudflare.com.',
    },
    {
      type: 'NS',
      name: domain,
      ttl: 86400,
      value: 'ns2.cloudflare.com.',
    },
    {
      type: 'CAA',
      name: domain,
      ttl: 86400,
      value: '0 issue "letsencrypt.org"',
    },
  ];

  if (recordType === 'ALL') {
    return allMockRecords;
  }

  return allMockRecords.filter((r) => r.type === recordType);
}

/**
 * Audit DNS security configuration (SPF, DMARC, CAA).
 */
export function auditDnsSecurity(records: DnsRecordEntry[]): DnsHealthCheck[] {
  const checks: DnsHealthCheck[] = [];

  const spfRecord = records.find(
    (r) => r.type === 'TXT' && r.value.includes('v=spf1')
  );
  if (spfRecord) {
    checks.push({
      category: 'SPF Email Authentication',
      status: 'pass',
      summary: 'Valid SPF TXT record detected',
      details: spfRecord.value,
    });
  } else {
    checks.push({
      category: 'SPF Email Authentication',
      status: 'warn',
      summary: 'No SPF record found in TXT results',
      details: 'Add an SPF TXT record to authorize outgoing email senders and prevent spoofing.',
    });
  }

  const dmarcRecord = records.find(
    (r) => r.type === 'TXT' && r.value.includes('v=DMARC1')
  );
  if (dmarcRecord) {
    checks.push({
      category: 'DMARC Domain Protection',
      status: 'pass',
      summary: 'DMARC enforcement policy active',
      details: dmarcRecord.value,
    });
  } else {
    checks.push({
      category: 'DMARC Domain Protection',
      status: 'warn',
      summary: 'No DMARC policy record found',
      details: 'Configure _dmarc TXT record with p=quarantine or p=reject.',
    });
  }

  const caaRecord = records.find((r) => r.type === 'CAA');
  if (caaRecord) {
    checks.push({
      category: 'CAA SSL Certificate Pinning',
      status: 'pass',
      summary: 'CAA record restricts authorized Certificate Authorities',
      details: caaRecord.value,
    });
  } else {
    checks.push({
      category: 'CAA SSL Certificate Pinning',
      status: 'warn',
      summary: 'No CAA record found',
      details: 'Without CAA, any public Certificate Authority can issue SSL certificates for this domain.',
    });
  }

  return checks;
}

export const DNS_LOOKUP_PRESETS: {
  name: string;
  domain: string;
  recordType: DnsRecordType;
  nameserver: string;
}[] = [
  {
    name: 'All DNS Records (Cloudflare DNS 1.1.1.1)',
    domain: 'devforge.io',
    recordType: 'ALL',
    nameserver: '1.1.1.1',
  },
  {
    name: 'Mail Exchange (MX) & Email Verification',
    domain: 'devforge.io',
    recordType: 'MX',
    nameserver: '8.8.8.8',
  },
  {
    name: 'TXT Records (SPF / DMARC Verification)',
    domain: 'devforge.io',
    recordType: 'TXT',
    nameserver: '1.1.1.1',
  },
];
