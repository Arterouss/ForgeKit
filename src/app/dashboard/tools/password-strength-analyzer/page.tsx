import type { Metadata } from 'next';
import { PasswordStrengthPro } from '@/components/tools/password-strength-analyzer';

export const metadata: Metadata = {
  title: 'Password Strength Analyzer & Entropy Auditor — DevForge Developer Studio',
  description:
    'Evaluate password cryptographic entropy, detect dictionary flaws, check character composition, and estimate offline GPU crack time locally.',
};

export default function PasswordStrengthPage() {
  return (
      <div className="flex flex-1 flex-col p-6">
        <PasswordStrengthPro />
      </div>
  );
}
