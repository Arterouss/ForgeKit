import type { Metadata } from 'next';
import { GitCheatSheetPro } from '@/components/tools/git-cheat-sheet';

export const metadata: Metadata = {
  title: 'Interactive Git Cheat Sheet — DevForge Developer Studio',
  description:
    'Searchable reference guide for Git workflows with live parameter substitution, safety risk indicators, and one-click terminal commands.',
};

export default function GitCheatSheetPage() {
  return (
      <div className="flex flex-1 flex-col p-6">
        <GitCheatSheetPro />
      </div>
  );
}
