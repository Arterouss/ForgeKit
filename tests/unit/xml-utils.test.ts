import { describe, it, expect } from 'vitest';
import {
  formatXml,
  minifyXml,
  validateXml,
  XML_PRESETS,
} from '@/lib/xml-utils';

describe('XML Utilities (xml-utils.ts)', () => {
  it('should format Maven POM preset cleanly', () => {
    const res = formatXml(XML_PRESETS[0].sampleXml, 2);
    expect(res.isValid).toBe(true);
    expect(res.output).toContain('<project');
    expect(res.output).toContain('<artifactId>devforge-core</artifactId>');
  });

  it('should minify XML accurately', () => {
    const xml = '<root>\n  <child>hello</child>\n</root>';
    const res = minifyXml(xml);
    expect(res.isValid).toBe(true);
    expect(res.output).toBe('<root><child>hello</child></root>');
  });

  it('should validate XML and detect unclosed tags', () => {
    const invalid = '<root><child>test</root>';
    const res = validateXml(invalid);
    expect(res.isValid).toBe(false);
    expect(res.message).toBeDefined();
  });

  it('should validate SOAP envelope preset correctly', () => {
    const soapPreset = XML_PRESETS[1];
    const res = validateXml(soapPreset.sampleXml);
    expect(res.isValid).toBe(true);
  });
});
