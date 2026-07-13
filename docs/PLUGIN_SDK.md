# DevForge Plugin & Extension SDK Documentation (`PLUGIN_SDK.md`)

Welcome to the **DevForge Extension SDK**. DevForge is designed as an extensible platform where developers can author third-party utility plugins, custom toolkits, and sandboxed extensions that run alongside our 60 core developer tools.

---

## 1. Plugin Manifest Specification (`plugin.json`)

Every DevForge plugin starts with a structured JSON manifest (`PluginManifest`). When installed via the **Marketplace Custom Installer** or programmatically via `pluginManager.installPlugin(manifest)`, the manifest is validated against strict security rules.

### Schema Definition

```json
{
  "id": "ai-prompt-studio",
  "name": "AI Prompt Engineering & Token Studio",
  "version": "1.2.0",
  "author": "DevForge Core AI Lab",
  "description": "Interactive prompt template editor with real-time approximate token counting.",
  "category": "text",
  "permissions": ["storage", "clipboard"],
  "homepage": "https://github.com/devforge/plugin-ai-prompt-studio",
  "tools": [
    {
      "slug": "ai-prompt-studio",
      "name": "AI Prompt & Token Studio",
      "description": "Design, interpolate, and estimate token counts for complex system prompts.",
      "category": "text",
      "keywords": ["ai", "prompt", "llm", "token"]
    }
  ]
}
```

### Manifest Fields & Rules

| Field | Type | Rule / Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique kebab-case identifier matching `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`. |
| `name` | `string` | Human-readable title of your plugin package. |
| `version` | `string` | Standard Semantic Versioning (`X.Y.Z`). |
| `author` | `string` | Author name or organization. |
| `description` | `string` | Short overview displayed in the Explore Marketplace cards. |
| `category` | `string` | Valid category (`formatting`, `encoding`, `api`, `security`, `devops`, `utilities`, etc.). |
| `permissions` | `Array<string>` | Required sandboxed capabilities: `'storage'`, `'clipboard'`, `'network'`, `'notifications'`. |
| `tools` | `Array<Object>` | List of tool definitions contributed to the global `ToolRegistry`. |

---

## 2. Security & Sandboxed Execution Guard

DevForge enforces a permission-checked execution wrapper (`executeSandboxed`). If a plugin attempts an action requiring a sensitive browser capability without declaring it in its manifest, execution is halted immediately and logged in the **Sandbox Audit Logs**.

### Using `executeSandboxed` in Plugin Tools

```typescript
import { executeSandboxed } from '@/sdk/plugin-sdk/plugin-sandbox';

// Example: Writing to LocalStorage safely
executeSandboxed(
  pluginId,
  manifest.permissions,
  'storage',
  'Save Custom Profile',
  () => {
    localStorage.setItem('my_plugin_key', JSON.stringify(data));
  }
);
```

---

## 3. Plugin Manager Singleton API

The `pluginManager` singleton (`src/sdk/plugin-sdk/plugin-manager.ts`) manages dynamic tool registration and unregistration:

- `pluginManager.installPlugin(manifest)`: Validates manifest and registers contributed tools into DevForge's `ToolRegistry`.
- `pluginManager.enablePlugin(pluginId)`: Activates an installed plugin and registers its tools.
- `pluginManager.disablePlugin(pluginId)`: Deactivates plugin and dynamically calls `unregisterTool(slug)`.
- `pluginManager.uninstallPlugin(pluginId)`: Disables and removes the plugin profile.

---

## 4. Testing Your Plugin Locally

1. Navigate to **DevForge Plugin Marketplace** (`/dashboard/marketplace` or press `Ctrl+M`).
2. Open the **Install Custom Manifest** tab.
3. Paste your `plugin.json` object and click **Validate & Install Manifest**.
4. Check the **Sandbox Audit Logs** tab to verify permission grants and execution events.
