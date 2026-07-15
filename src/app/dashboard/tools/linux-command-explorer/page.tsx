import type { Metadata } from 'next';
import { LinuxCommandExplorerPro } from '@/components/tools/linux-command-explorer';

export const metadata: Metadata = {
  title: 'Linux Command Explorer — DevForge Developer Studio',
  description:
    'Interactive Linux server administration and DevOps CLI database with flag reference breakdowns, syntax templates, and real-world production examples.',
};

export default function LinuxCommandExplorerPage() {
  return (
      <div className="flex flex-1 flex-col p-6">
        <LinuxCommandExplorerPro />
      </div>
  );
}
