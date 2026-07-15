import type { Metadata } from 'next';
import { CronBuilderPro } from '@/components/tools/cron-builder';

export const metadata: Metadata = {
  title: 'Cron Expression Builder — DevForge Developer Studio',
  description:
    'Interactive 5-field Linux crontab schedule generator with human-readable natural language descriptor, execution presets, and system user crontab formatting.',
};

export default function CronBuilderPage() {
  return (
      <div className="flex flex-1 flex-col p-6">
        <CronBuilderPro />
      </div>
  );
}
