# DevForge Design System v3.0

> **Status**: Official Design Specification  
> **Aesthetic Benchmarks**: Raycast, Linear, Arc Browser, Warp Terminal, VS Code, Vercel.  
> **Core Axiom**: "Desktop-First Browser OS" — Never resemble an admin dashboard or generic Bootstrap/Tailwind template.

---

## 1. Color System & Spatial Surfaces

DevForge utilizes a calibrated multi-layer dark glass architecture anchored by obsidian `#09090b`.

```css
:root {
  /* Canvas & Base Viewport */
  --background: #09090b;
  --foreground: #f8fafc;

  /* Surface Depth Layers */
  --surface-1: rgba(255, 255, 255, 0.025);
  --surface-2: rgba(255, 255, 255, 0.05);
  --surface-3: rgba(255, 255, 255, 0.08);

  /* Sub-pixel Hairline Borders */
  --border: rgba(255, 255, 255, 0.08);
  --border-hover: rgba(139, 92, 246, 0.5); /* Electric Violet Glow */

  /* Accents */
  --primary: #7c3aed;
  --primary-glow: rgba(124, 58, 237, 0.25);
  --cyan-wasm: #22d3ee;
}
```

---

## 2. Radii & Geometry Scale

- **Windows & Hero Containers**: `rounded-[28px]` (`1.75rem`) — Used for top-level modal sheets and landing features.
- **Interactive Cards (`ToolCard`, `CategoryCard`)**: `rounded-[24px]` (`1.5rem`) — Used for all tool tiles and grid cards.
- **Buttons, Pills & Badges**: `rounded-2xl` (`1rem`) to `rounded-xl` (`0.75rem`) — Ensures clean inner curvature nesting.

---

## 3. Typography & Monospaced Hierarchy

- **Display & Headings**: `Inter` / `Outfit` (`font-heading`) with extra bold weighting (`font-extrabold text-xl` to `text-5xl`) and tight letter spacing (`tracking-tight`).
- **Body & Descriptions**: `text-sm` (`14px`) with high-contrast muted foreground (`text-muted-foreground`) and relaxed line height.
- **Code & Shortcuts**: `JetBrains Mono` / `Fira Code` (`font-mono`) with crisp `<kbd>` styling (`bg-white/[0.08] px-1.5 py-0.5 rounded text-[10px]`).

---

## 4. Component Rules

### A. Cards (`ToolCard` & `CategoryCard`)
1. Must enforce `rounded-[24px]` and `border-white/[0.08] bg-white/[0.025] backdrop-blur-xl`.
2. Must include gradient icon containers (`h-12 w-12 rounded-2xl`).
3. Must maintain equal height across responsive grid columns.
4. Hover states trigger border transition to `border-primary/50` and subtle elevation without layout shift.

### B. Navigation & Sidebar
1. Sidebar expanded width strictly `288px` (`w-72`), collapsed width `72px` (`w-[72px]`).
2. Active navigation item uses a vertical left accent bar (`w-0.5 bg-primary`) and subtle surface (`bg-white/[0.045]`) instead of heavy background fills.
3. Sticky category labels keep context clear during vertical scrolling.

### C. Buttons & CTAs
1. Primary CTA: High-contrast electric violet (`bg-gradient-to-r from-primary to-violet-600 text-white shadow-lg shadow-primary/20`).
2. Secondary / Ghost CTA: Sub-pixel bordered glass (`border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06]`).

---

## 5. Motion & Micro-Interactions

- Powered by `framer-motion` (`180ms` – `300ms` duration).
- Spring physics (`stiffness: 380, damping: 30`) used for active tab indicators and layout transitions.
- Fully compliant with system `prefers-reduced-motion` settings.
