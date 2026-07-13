import { describe, it, expect } from 'vitest';
import {
  generateSystemdUnitFile,
  generateSystemctlCommands,
  validateSystemdConfig,
  SYSTEMD_PRESETS,
} from '@/lib/systemd-utils';

describe('Systemd Service Builder Utilities (systemd-utils.ts)', () => {
  it('should generate structured .service unit file correctly', () => {
    const config = SYSTEMD_PRESETS[0].config;
    const unit = generateSystemdUnitFile(config);

    expect(unit).toContain('[Unit]');
    expect(unit).toContain('Description=DevForge Next.js Web Application Server');
    expect(unit).toContain('[Service]');
    expect(unit).toContain('ExecStart=/usr/bin/node');
    expect(unit).toContain('ProtectSystem=full');
    expect(unit).toContain('[Install]');
    expect(unit).toContain('WantedBy=multi-user.target');
  });

  it('should generate systemctl installation and lifecycle commands', () => {
    const config = SYSTEMD_PRESETS[0].config;
    const cmds = generateSystemctlCommands(config);

    expect(cmds).toContain('sudo cp devforge-app.service /etc/systemd/system/devforge-app.service');
    expect(cmds).toContain('sudo systemctl daemon-reload');
    expect(cmds).toContain('sudo systemctl enable --now devforge-app.service');
  });

  it('should invalidate empty ExecStart or name', () => {
    const res = validateSystemdConfig({
      name: '',
      description: 'Test',
      afterTargets: [],
      serviceType: 'simple',
      user: '',
      group: '',
      workingDirectory: '',
      execStart: '',
      restartPolicy: 'no',
      restartSec: 0,
      environmentVars: [],
      protectSystem: false,
      privateTmp: false,
      wantedBy: 'multi-user.target',
    });

    expect(res.isValid).toBe(false);
  });
});
