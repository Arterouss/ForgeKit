# DevForge Tool SDK — Developer Guide

The **DevForge Tool SDK** is designed to allow developers to build and integrate robust, high-performance developer tools into the DevForge platform with minimal boilerplate.

---

## 1. Core Architecture Overview

Every tool built in DevForge leverages three primary layers:
1. **Core Processing Engine** (`src/lib/<tool>-utils.ts`): Pure TypeScript functions with zero UI coupling, fully unit-tested with Vitest.
2. **Interactive UI Component** (`src/components/tools/<tool>/<tool>-pro.tsx`): Built using reusable Tool Engine layout primitives (`ToolPage`, `ToolToolbar`, `InputPanel`, `OutputPanel`, `StatusArea`).
3. **SDK Hooks & Registry Integration** (`src/sdk/`): Centralized metadata registration (`registerTool`) making the tool instantly discoverable across Dashboard, Command Palette (`Ctrl+K`), and Navigation categories.

---

## 2. Reusable SDK Primitives (`@/sdk`)

### Hooks (`src/sdk/tool-hooks.ts`)
- **`useClipboard(timeoutMs = 1500)`**: Returns `{ copied, copyToClipboard(text) }` for one-click copy feedback.
- **`useDownload()`**: Returns `{ downloadFile(content, filename, mimeType) }` to generate client-side downloads.
- **`useUpload()`**: Returns `{ readUploadedFile(file) }` returning a Promise resolving to the file's text content.
- **`useToolState<T>(initialValue, storageKey)`**: Stateful hook with optional automatic `localStorage` persistence.
- **`useTool(slug)`**: Retrieves registered metadata for a given tool slug.

### Utilities (`src/sdk/tool-utils.ts`)
- **`validateMetadata(tool)`**: Validates that tool metadata adheres to schema rules.
- **`copyToClipboard(text)`**: Standalone async clipboard copy.
- **`downloadAsFile(content, filename, mimeType)`**: Standalone browser file download.
- **`readFileAsText(file)`**: Standalone file reader helper.

---

## 3. Step-by-Step Guide: Adding a New Tool

### Step 1: Write Core Logic (`src/lib/mytool-utils.ts`)
Create clean, deterministic helper functions:
```ts
export function processText(input: string): { result: string; error: string | null } {
  if (!input.trim()) return { result: '', error: null };
  return { result: input.toUpperCase(), error: null };
}
```

### Step 2: Write Unit Tests (`tests/unit/mytool.test.ts`)
Write Vitest tests for 100% logic confidence:
```ts
import { describe, it, expect } from 'vitest';
import { processText } from '@/lib/mytool-utils';

describe('My Tool', () => {
  it('converts text to uppercase', () => {
    expect(processText('hello').result).toBe('HELLO');
  });
});
```

### Step 3: Build Tool UI Component (`src/components/tools/mytool/my-tool-pro.tsx`)
Use standard DevForge layout primitives:
```tsx
'use client';
import { useState } from 'react';
import { ToolPage, ToolToolbar, InputPanel, OutputPanel } from '@/components/tools';

export function MyToolPro() {
  const [input, setInput] = useState('');
  return (
    <ToolPage
      title="My Tool Pro"
      description="Process developer strings effortlessly"
      category="Text"
      toolbar={<ToolToolbar onClear={() => setInput('')} />}
      inputPanel={<InputPanel title="Input" value={input} onChange={setInput} />}
      outputPanel={<OutputPanel title="Output" value={input.toUpperCase()} />}
    />
  );
}
```

### Step 4: Register in `src/sdk/tools-init.ts`
Link metadata and component:
```ts
registerTool({
  slug: 'my-tool',
  name: 'My Tool Pro',
  description: 'Process developer strings effortlessly',
  category: 'text',
  icon: 'Terminal',
  tags: ['text', 'uppercase'],
  keywords: ['string processing'],
  version: '1.0.0',
  status: 'stable',
  component: MyToolPro,
});
```
