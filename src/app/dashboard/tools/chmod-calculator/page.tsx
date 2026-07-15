import type { Metadata } from 'next';
import { ChmodCalculatorPro } from '@/components/tools/chmod-calculator';

export const metadata: Metadata = {
  title: 'chmod Calculator Pro — DevForge Developer Studio',
  description:
    'Interactive Linux permission matrix calculator with bidirectional Octal (755) and Symbolic (-rwxr-xr-x) conversion, special bits (SUID/SGID/Sticky), and CLI chmod command builder.',
};

export default function ChmodCalculatorPage() {
  return (
      <div className="flex flex-1 flex-col p-6">
        <ChmodCalculatorPro />
      </div>
  );
}
