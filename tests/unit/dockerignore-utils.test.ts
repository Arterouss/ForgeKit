import { describe, it, expect } from 'vitest';
import {
  mergeDockerignoreRules,
  deduplicateDockerignore,
  DOCKERIGNORE_STACKS,
} from '@/lib/dockerignore-utils';

describe('Dockerignore Utilities (dockerignore-utils.ts)', () => {
  it('should merge stacks into clean .dockerignore output', () => {
    const sec = DOCKERIGNORE_STACKS.find((s) => s.name.includes('Security'))!;
    const node = DOCKERIGNORE_STACKS.find((s) => s.name.includes('Node.js'))!;
    const out = mergeDockerignoreRules([sec, node]);
    expect(out).toContain('.git');
    expect(out).toContain('node_modules');
    expect(out).toContain('# ===== Security & Secrets (MUST HAVE) =====');
  });

  it('should deduplicate identical rules while preserving headers', () => {
    const raw = `# Header\nnode_modules\n.env\nnode_modules\n.env`;
    const res = deduplicateDockerignore(raw);
    const matches = res.match(/^node_modules$/gm);
    expect(matches).toHaveLength(1);
  });
});
