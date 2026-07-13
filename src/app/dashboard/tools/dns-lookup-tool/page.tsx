import type { Metadata } from 'next';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { DnsLookupToolPro } from '@/components/tools/dns-lookup-tool';

export const metadata: Metadata = {
  title: 'DNS Lookup Tool — DevForge Developer Studio',
  description:
    'Inspect domain DNS records (A, AAAA, MX, TXT, NS, CAA), generate CLI lookup commands (dig, nslookup, host), and audit email authentication records (SPF & DMARC).',
};

export default function DnsLookupToolPage() {
  return (
    <DashboardShell>
      <div className="flex flex-1 flex-col p-6">
        <DnsLookupToolPro />
      </div>
    </DashboardShell>
  );
}
