import type { Metadata } from 'next';
import { UuidUlidPro } from '@/components/tools/uuid-ulid-generator';

export const metadata: Metadata = {
  title: 'UUID v4 / UUID v7 / ULID Generator & Timestamp Decoder — DevForge Developer Studio',
  description:
    'Generate standard random UUID v4, time-ordered RFC 9562 UUID v7, and sortable 26-char ULIDs, plus extract embedded creation timestamps.',
};

export default function UuidUlidPage() {
  return (
      <div className="flex flex-1 flex-col p-6">
        <UuidUlidPro />
      </div>
  );
}
