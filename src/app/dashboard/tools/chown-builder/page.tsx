import type { Metadata } from 'next';
import { ChownBuilderPro } from '@/components/tools/chown-builder';

export const metadata: Metadata = {
  title: 'chown Command Builder — DevForge Developer Studio',
  description:
    'Interactive Linux chown & chgrp command generator with recursive ownership rules, UID/GID syntax, symlink dereference options, and preserve-root safeguards.',
};

export default function ChownBuilderPage() {
  return (
      <div className="flex flex-1 flex-col p-6">
        <ChownBuilderPro />
      </div>
  );
}
