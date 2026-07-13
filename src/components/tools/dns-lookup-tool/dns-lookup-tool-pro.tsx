'use client';

import { useState, useMemo } from 'react';
import {
  Globe,
  Server,
  ShieldCheck,
  AlertTriangle,
  Terminal,
} from 'lucide-react';
import {
  generateDnsCommands,
  simulateDnsLookup,
  auditDnsSecurity,
  DNS_LOOKUP_PRESETS,
  type DnsRecordType,
} from '@/lib/dns-lookup-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

const RECORD_TYPES: DnsRecordType[] = [
  'ALL',
  'A',
  'AAAA',
  'MX',
  'TXT',
  'NS',
  'CAA',
];

export function DnsLookupToolPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [domain, setDomain] = useState<string>('devforge.io');
  const [recordType, setRecordType] = useState<DnsRecordType>('ALL');
  const [nameserver, setNameserver] = useState<string>('1.1.1.1');
  const [activeCommandTab, setActiveCommandTab] = useState<'dig' | 'nslookup' | 'host'>('dig');

  const commands = useMemo(
    () =>
      generateDnsCommands({
        domain,
        recordType,
        nameserver,
      }),
    [domain, recordType, nameserver]
  );

  const mockRecords = useMemo(
    () => simulateDnsLookup(domain, recordType),
    [domain, recordType]
  );

  const securityAudit = useMemo(
    () => auditDnsSecurity(mockRecords),
    [mockRecords]
  );

  const currentCommandOutput = commands[activeCommandTab];

  const handleRunQuery = () => {
    addHistoryItem('DNS Lookup Tool', `Queried ${recordType} records for ${domain}`);
  };

  const exportJson = useMemo(
    () =>
      JSON.stringify(
        {
          domain,
          nameserver,
          recordTypeQueried: recordType,
          records: mockRecords,
          securityAudit,
          cliCommands: commands,
        },
        null,
        2
      ),
    [domain, nameserver, recordType, mockRecords, securityAudit, commands]
  );

  return (
    <ToolPage
      title="DNS Lookup Tool"
      description="Inspect domain DNS records (A, AAAA, MX, TXT, NS, CAA), generate CLI lookup commands (dig, nslookup, host), and audit email authentication records (SPF & DMARC)"
      category="Network"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <select
              onChange={(e) => {
                const preset = DNS_LOOKUP_PRESETS.find(
                  (p) => p.name === e.target.value
                );
                if (preset) {
                  setDomain(preset.domain);
                  setRecordType(preset.recordType);
                  setNameserver(preset.nameserver);
                }
              }}
              className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Load DNS Query Preset...
              </option>
              {DNS_LOOKUP_PRESETS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveCommandTab('dig')}
                className={`rounded px-2.5 py-1 text-xs font-bold transition-colors ${
                  activeCommandTab === 'dig'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:text-foreground'
                }`}
              >
                dig
              </button>
              <button
                type="button"
                onClick={() => setActiveCommandTab('nslookup')}
                className={`rounded px-2.5 py-1 text-xs font-bold transition-colors ${
                  activeCommandTab === 'nslookup'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:text-foreground'
                }`}
              >
                nslookup
              </button>
              <button
                type="button"
                onClick={() => setActiveCommandTab('host')}
                className={`rounded px-2.5 py-1 text-xs font-bold transition-colors ${
                  activeCommandTab === 'host'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:text-foreground'
                }`}
              >
                host
              </button>
            </div>
          </div>

          <ToolToolbar
            onRun={handleRunQuery}
            runLabel="Run Lookup Query"
            onLoadSample={() => {
              setDomain('devforge.io');
              setRecordType('ALL');
              setNameserver('1.1.1.1');
            }}
            onClear={() => setDomain('')}
            onCopyOutput={() => copyOutput(currentCommandOutput)}
            canCopy={Boolean(currentCommandOutput)}
            onDownloadOutput={() =>
              downloadFile(exportJson, `${domain || 'domain'}-dns-records.json`)
            }
            canDownload={Boolean(exportJson)}
          />
        </div>
      }
      statusArea={
        <StatusArea
          status="success"
          message={`${mockRecords.length} DNS Records Found`}
          detail={`Domain: ${domain} (@${nameserver})`}
        />
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-4">
          {/* Query Bar */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground border-b border-border pb-2">
              <Globe className="h-4 w-4 text-primary" />
              <span>Domain Name, Record Type & Nameserver</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                  Domain Name
                </label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="devforge.io"
                  className="w-full rounded-lg border border-border bg-card px-3 py-1.5 font-mono text-xs text-foreground focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                  Record Type
                </label>
                <select
                  value={recordType}
                  onChange={(e) =>
                    setRecordType(e.target.value as DnsRecordType)
                  }
                  className="w-full rounded-lg border border-border bg-card px-3 py-1.5 font-mono text-xs font-bold text-primary focus:outline-none"
                >
                  {RECORD_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t} {t === 'ALL' ? '(All Types)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                  Nameserver Resolver
                </label>
                <select
                  value={nameserver}
                  onChange={(e) => setNameserver(e.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-3 py-1.5 font-mono text-xs text-foreground focus:outline-none"
                >
                  <option value="1.1.1.1">1.1.1.1 (Cloudflare)</option>
                  <option value="8.8.8.8">8.8.8.8 (Google Public DNS)</option>
                  <option value="9.9.9.9">9.9.9.9 (Quad9 Security)</option>
                  <option value="208.67.222.222">208.67.222.222 (OpenDNS)</option>
                </select>
              </div>
            </div>
          </div>

          {/* CLI Command Banner */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
              <Terminal className="h-4 w-4" />
              <span>{activeCommandTab.toUpperCase()} Terminal Query Command</span>
            </div>
            <pre className="overflow-x-auto rounded bg-card p-2.5 font-mono text-xs text-foreground">
              {currentCommandOutput}
            </pre>
          </div>

          {/* Security & Health Checks */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-foreground">
              DNS Security Posture Audit (SPF, DMARC, CAA)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {securityAudit.map((audit) => (
                <div
                  key={audit.category}
                  className="rounded-xl border border-border bg-background p-3 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary">
                      {audit.category}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                        audit.status === 'pass'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {audit.status === 'pass' ? (
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3" /> Protected
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> Warning
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-foreground">
                    {audit.summary}
                  </div>
                  <div className="text-[11px] font-mono text-muted-foreground break-all">
                    {audit.details}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DNS Records Table */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <Server className="h-4 w-4 text-primary" />
              <span>Resolved DNS Resource Records</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border bg-background">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-border bg-card text-muted-foreground">
                    <th className="p-2.5 font-bold">Type</th>
                    <th className="p-2.5 font-bold">Name</th>
                    <th className="p-2.5 font-bold">TTL</th>
                    <th className="p-2.5 font-bold">Priority</th>
                    <th className="p-2.5 font-bold">Value / Target</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockRecords.map((r, idx) => (
                    <tr key={`${r.type}_${idx}`} className="hover:bg-card/40">
                      <td className="p-2.5">
                        <span className="rounded bg-primary/10 px-2 py-0.5 font-bold text-primary">
                          {r.type}
                        </span>
                      </td>
                      <td className="p-2.5 font-semibold text-foreground">
                        {r.name}
                      </td>
                      <td className="p-2.5 text-muted-foreground">{r.ttl}s</td>
                      <td className="p-2.5 text-muted-foreground">
                        {r.priority !== undefined ? r.priority : '-'}
                      </td>
                      <td className="p-2.5 text-foreground break-all">
                        {r.value}
                      </td>
                    </tr>
                  ))}
                  {mockRecords.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-muted-foreground">
                        No DNS records found for this query type.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }
      outputPanel={
        <OutputPanel
          title="DNS Lookup Report & CLI Commands (JSON)"
          value={exportJson}
          language="json"
        />
      }
    />
  );
}
