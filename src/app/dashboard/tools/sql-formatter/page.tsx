import type { Metadata } from 'next';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { SqlFormatterPro } from '@/components/tools/sql-formatter';

export const metadata: Metadata = {
  title: 'SQL Formatter Pro — DevForge Developer Studio',
  description:
    'Beautify, minify, validate, and inspect SQL queries with multi-dialect support and query analytics.',
};

export default function SqlFormatterPage() {
  return (
    <DashboardShell>
      <div className="flex flex-1 flex-col p-6">
        <SqlFormatterPro />
      </div>
    </DashboardShell>
  );
}
