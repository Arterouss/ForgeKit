import { describe, it, expect } from 'vitest';
import {
  generateBashScript,
  validateBashScriptConfig,
  BASH_PRESETS,
} from '@/lib/bash-script-utils';

describe('Bash Script Generator Utilities (bash-script-utils.ts)', () => {
  it('should generate production deployment script with all boilerplate features', () => {
    const config = BASH_PRESETS[0].config;
    const script = generateBashScript(config);

    expect(script).toContain('#!/usr/bin/env bash');
    expect(script).toContain('set -euo pipefail');
    expect(script).toContain('log_info()');
    expect(script).toContain('trap cleanup EXIT INT TERM');
    expect(script).toContain('--env)');
    expect(script).toContain('main "$@"');
  });

  it('should handle scripts without arg parser or trap', () => {
    const config = BASH_PRESETS[2].config;
    const script = generateBashScript(config);

    expect(script).toContain('#!/usr/bin/env bash');
    expect(script).toContain('curl -s -o /dev/null');
    expect(script).not.toContain('while [[ $# -gt 0 ]]');
  });

  it('should invalidate empty script name', () => {
    const res = validateBashScriptConfig({
      ...BASH_PRESETS[0].config,
      scriptName: '',
    });

    expect(res.isValid).toBe(false);
  });
});
