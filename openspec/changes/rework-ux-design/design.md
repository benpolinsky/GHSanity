## Context

GH Sanity is a Next.js 15 / React 19 app for managing GitHub notifications. The current UI has a working feature set—type/reason/state/draft filters, notification list grouped by repo, bulk selection, settings (label exclusion, repo prioritization), command palette (Cmd+K), and rate limit display—but the visual layer is ad hoc. Hardcoded hex values across 12+ CSS Module files, a flat `display: flex` layout with no hierarchy, unstyled settings overlay, and a cramped sidebar filter column.

The component architecture (`App.tsx` → `Filters` + `NotificationList` + `SettingsPane` + `CommandPalette`) is sound and the state management layer (Context + useReducer) stays unchanged. This redesign is purely a presentation-layer rework: new CSS token system, restructured layout, restyled components, enhanced UX surfaces. No API or reducer changes.

All visual work follows the **frontend-design skill** — modern dashboard aesthetic, bold accent on dark base, readability-first sans-serif, controlled density, CSS-only motion.

## Goals / Non-Goals

**Goals:**

- Establish a design token system (CSS custom properties) as the single source of truth for all visual values
- Replace the current 3-column flat layout with a toolbar + content area architecture
- Move filters from the sidebar into a horizontal bar integrated with the content header
- Redesign notification items for maximum scannable density — all metadata visible per row
- Rebuild the settings pane as a structured slide-out panel
- Surface bulk and individual actions prominently with clear affordances
- Enhance the command palette as a primary navigation/action layer
- Achieve a cohesive modern dashboard aesthetic with distinctive typography and a bold accent color
- Use the **frontend-design skill** for every visual decision

**Non-Goals:**

- Changing the GitHub API integration or data fetching logic
- Modifying the reducer, actions, or state shape
- Adding new data capabilities (e.g., fetching comments, PR reviews)
- Building a full design system library or Storybook
- Supporting mobile/responsive layouts (desktop-first tool; responsive is a future concern)
- Dark/light theme toggle (dark-mode-first; light mode support is a future enhancement)

## Decisions

### 1. Design Token Architecture

**Decision:** Define all tokens in `src/index.css` as CSS custom properties on `:root`. Components consume tokens exclusively — no hardcoded values in any `.module.css` file.

**Token categories:**

- `--color-bg-*`: Background surfaces (base, elevated, overlay)
- `--color-fg-*`: Text colors (primary, secondary, muted, inverse)
- `--color-accent-*`: Accent and its variants (default, hover, muted)
- `--color-border-*`: Border colors (subtle, default, strong)
- `--color-state-*`: Semantic states (success/open, danger/closed, warning/draft, info)
- `--space-*`: Spacing scale (2xs through 3xl, exponential: 2, 4, 6, 8, 12, 16, 24, 32, 48, 64)
- `--radius-*`: Border radii (sm, md, lg)
- `--font-*`: Font families (sans, mono)
- `--text-*`: Font sizes (xs through 2xl)
- `--weight-*`: Font weights (normal, medium, semibold, bold)
- `--shadow-*`: Elevation shadows (sm, md, lg)
- `--transition-*`: Timing functions and durations (fast, normal, slow)

**Why not a JS-based token system (e.g., vanilla-extract, Tailwind)?** CSS custom properties are zero-dependency, work natively with CSS Modules, require no build config changes, and are what the codebase already supports. No new tooling needed.

**Alternatives considered:**

- Tailwind CSS — would require significant config changes and rewiring all components. Overkill for this scope.
- CSS-in-JS (styled-components, vanilla-extract) — adds runtime or build complexity. Not worth it for a token migration.

### 2. Color Palette

**Decision:** Near-black base with cool gray surfaces. **Electric coral (`#FF4F40`)** as the primary accent — unexpected, high-contrast against dark surfaces, and visually distinct from GitHub's own blue/green/purple.

```
Base:       #0a0a0b (near-black, app background)
Surface 1:  #111113 (cards, list background)
Surface 2:  #1a1a1d (elevated — filter bar, action bar)
Surface 3:  #242428 (overlays — settings panel, command palette)
Border:     #2a2a2f (subtle), #3a3a40 (default), #4a4a52 (strong)
Text:       #e8e8ec (primary), #a0a0a8 (secondary), #68686f (muted)
Accent:     #FF4F40 (electric coral), #FF6B5E (hover), #FF4F4020 (muted/bg)
State:      #3fb950 (open/success), #f85149 (closed/danger), #d29922 (draft/warning), #58a6ff (info)
```

The state colors intentionally align with GitHub's own state colors (green=open, red=closed) so the mapping is instantly familiar.

**Subtle noise:** A CSS-generated noise texture (`background-image` with SVG filter or a tiny base64 PNG) applied to the base background at very low opacity (~3-5%) for depth.

**Why electric coral over teal/magenta/chartreuse?** Coral is warm against the cool dark palette — creates visual tension that draws the eye. It reads as energetic without being aggressive. Teal (#03dac6) was the existing accent and felt too Material Design. Magenta risks feeling too playful. Chartreuse has legibility issues at small sizes.

### 3. Typography

**Decision:** **DM Sans** for the UI sans-serif. **JetBrains Mono** for monospace metadata.

- DM Sans: Geometric sans-serif with excellent legibility at small sizes, good weight range (400–700), distinctive letterforms that aren't generic. Available on Google Fonts. Not Inter, not Roboto, not system-ui.
- JetBrains Mono: Highly legible monospace designed for developers. Used for notification counts, repo names, labels, rate limit data.

**Type scale (rem-based, 14px root):**

```
--text-xs:   0.75rem  (10.5px — muted metadata)
--text-sm:   0.857rem (12px — secondary text, labels)
--text-base: 1rem     (14px — body, notification titles)
--text-md:   1.143rem (16px — section headers)
--text-lg:   1.286rem (18px — toolbar title)
--text-xl:   1.571rem (22px — rarely used)
```

**Why DM Sans over Geist or Plus Jakarta Sans?** DM Sans has more character than Geist (which is very neutral/Apple-like) and better small-size legibility than Plus Jakarta Sans. Its geometric forms feel modern-dashboard-appropriate without being bland.

### 4. Layout Architecture

**Decision:** Single-column layout with a fixed top toolbar. No sidebar.

```
┌──────────────────────────────────────────────────┐
│ Toolbar: [Logo/Title] [Filter Bar] [Actions] [⚙] │
├──────────────────────────────────────────────────┤
│                                                  │
│  Notification List (full width)                  │
│  ┌─ Repo Group Header ─────────── [Select All] ┐│
│  │  ● PR title here          labels  state  ✓  ││
│  │  ● Issue title here       labels  state  ✓  ││
│  └──────────────────────────────────────────────┘│
│  ┌─ Repo Group Header ─────────── [Select All] ┐│
│  │  ...                                         ││
│  └──────────────────────────────────────────────┘│
│                                                  │
├──────────────────────────────────────────────────┤
│ [Selection Action Bar — appears when items       │
│  are selected: "3 selected" Mark Read | Deselect]│
└──────────────────────────────────────────────────┘
```

**Toolbar** is a single horizontal strip containing:

- App identity (small text or icon, left)
- Filter controls (center — type segments, reason pills, state/draft toggles)
- Global actions (right — notification count, settings gear)

**Why fixed toolbar + no sidebar?** The current sidebar wastes horizontal space (80px column for vertically stacked text links). Notifications need maximum horizontal width to display title + metadata inline. A horizontal toolbar uses dead vertical space (top of viewport) and keeps the full width for content. This is the Linear/GitHub Issues/Vercel dashboard pattern — proven for information-dense list UIs.

**Alternatives considered:**

- Collapsible sidebar — still steals width when open, and adds a show/hide toggle to manage. Not worth the complexity for 4 filter categories.
- Filters inside notification list header — would work but crowds the per-repo group headers. Keeping filters at toolbar level separates global filtering from per-repo actions.

### 5. Filter Bar Design

**Decision:** Three distinct filter groups in the toolbar, left to right:

1. **Type segments** — `All | PRs | Issues | Releases` as a segmented control (pill group). Active segment highlighted with accent background. Each shows a count badge.
2. **Reason pills** — `Assigned | Participating | Mentioned | Team | Review Requested` as toggleable chips. Active = accent border + muted accent background. Each shows count.
3. **State + Draft toggles** — `Open | Closed | All` as a small segmented control, plus a `Drafts` toggle switch.

All filter components dispatch to the existing reducer actions (`SET_FILTER`, `SET_REASON_FILTER`, `SET_STATE_FILTER`, `TOGGLE_DRAFT_FILTER`). No state changes needed.

**Component restructure:**

- `Filters.tsx` → `FilterBar.tsx` (horizontal container in toolbar)
- `NotificationTypeFilter.tsx` → `TypeSegments.tsx` (segmented control)
- `ReasonFilters.tsx` → `ReasonPills.tsx` (chip/pill toggles)
- `StateFilter.tsx` + `DraftFilter.tsx` → `StateControls.tsx` (combined segment + toggle)

### 6. Notification Item Density

**Decision:** Each notification row is a single horizontal line with all metadata visible:

```
[☐] [●PR] Title of the notification here          repo/name  labels  [open] [✓]
```

- **Checkbox** — left edge, always visible, compact
- **Type icon** — colored SVG (PR=green/purple, Issue=green/red, Release=blue), sized 14px
- **Title** — truncated with ellipsis, flex-grow to fill available space, accent color on hover
- **Repo name** — monospace, muted, right-aligned before labels (only shown if not already under a repo group header — for ungrouped/search views)
- **Labels** — compact colored chips, max 2 visible + "+N" overflow
- **State badge** — `open`/`closed`/`draft` as a small colored pill
- **Quick action** — check icon for mark-as-read, appears on hover (always visible for touch)

Row height target: ~32px. Dense enough to see 20+ notifications without scrolling on a standard viewport.

**Repo group headers** become a compact divider row:

```
repo-org/repo-name (12)                              [Select All]
```

Monospace repo name, muted count, right-aligned select-all toggle. No `<h2>` — just a styled divider with slightly elevated background.

### 7. Settings Panel

**Decision:** Right-side slide-out panel (not a centered modal). 320px wide, slides in from the right edge with a backdrop overlay.

**Why slide-out over modal?** The notification list remains partially visible behind the panel, maintaining spatial context. Modals feel like interruptions; slide-outs feel like revealing a hidden section. This matches the dashboard pattern (Vercel, Linear, Notion all use slide-outs for settings/details).

**Panel structure:**

```
┌─────────────────────┐
│ Settings         [×] │
├─────────────────────┤
│ § Label Exclusions   │
│   [combobox input]   │
│   tag  tag  tag      │
├─────────────────────┤
│ § Repo Prioritization│
│   [combobox input]   │
│   1. repo/name  [×]  │
│   2. repo/name  [×]  │
├─────────────────────┤
│ § API Rate Limit     │
│   ████████░░ 42/60   │
└─────────────────────┘
```

- Clear section headers with subtle dividers
- Rate limit displayed as a progress bar instead of raw text
- Combobox inputs styled to match the token system
- Escape key or backdrop click closes

### 8. Bulk Action Bar

**Decision:** A fixed-position bar at the bottom of the viewport that appears when 1+ notifications are selected. Contains: selection count, "Mark as Read" button, "Deselect All" button.

```
┌──────────────────────────────────────────────────┐
│  3 selected          [Mark as Read] [Deselect]   │
└──────────────────────────────────────────────────┘
```

Slides up with a CSS transition. Accent-colored background to establish clear visual mode. Replaces the current top-positioned "Select All / Mark Selected as Read" buttons which are always visible and take space even when nothing is selected.

### 9. Command Palette Enhancement

**Decision:** Keep the existing Fuse.js search but expand the palette's role:

- **Search notifications** (existing) — results show type icon + title + repo
- **Filter commands** — typing `type:pr` or `reason:assigned` applies filters
- **Action commands** — `mark-all-read`, `select-all`, `deselect-all`
- **Navigation** — `repo:org/name` jumps to that repo group

The palette gets restyled with the token system: dark elevated surface, subtle border, monospace input hint, keyboard-navigable results with highlighted matching text.

This is a progressive enhancement — the search still works as before, but power users can discover command syntax over time. Implementation: extend the existing `CommandPalette.tsx` with a command parser that checks for prefixes before falling through to Fuse.js search.

### 10. Motion Strategy

**Decision:** CSS-only animations. No JS animation library.

- **Filter transitions:** Active state changes with `transition: background-color 150ms, color 150ms` on filter segments/pills
- **Notification rows:** New/filtered rows animate in with `opacity 0→1, translateY 4px→0` over 200ms with staggered `animation-delay` (max 10 items, then instant)
- **Settings panel:** `transform: translateX(100%) → translateX(0)` over 250ms ease-out, backdrop fades in 200ms
- **Bulk action bar:** `transform: translateY(100%) → translateY(0)` over 200ms ease-out
- **Done state:** Notification rows fade to 60% opacity over 300ms when marked as read
- **Loading spinner:** Keep the existing CSS rotation animation, restyle with accent color

No scroll-triggered animations, no parallax, no elaborate choreography. This is a utility tool — motion serves as feedback, not spectacle.

## Risks / Trade-offs

- **[Font loading flash]** → Load DM Sans and JetBrains Mono via `<link rel="preload">` in `layout.tsx`. Use `font-display: swap` with a fallback stack (`'DM Sans', system-ui, sans-serif`) so the layout never shifts. Monospace fallback: `'JetBrains Mono', 'Cascadia Code', monospace`.

- **[Scope creep — "while we're at it" additions]** → Strictly no new features. The command palette gets filter/action commands as a UX enhancement, but no new data fetching, no new API calls, no new state shape. If it requires a new reducer action, it's out of scope.

- **[CSS specificity conflicts during migration]** → Migrate file by file. Each `.module.css` file is scoped, so we can convert one component at a time to tokens without breaking others. The old hardcoded values still work until replaced.

- **[Notification row density too tight]** → 32px target is aggressive. If legibility suffers at 14px base font, relax to 36px rows. Test with real notification data, not placeholder text.

- **[Command palette prefix syntax discoverability]** → Add a subtle hint row at the bottom of the open palette: `"Try: type:pr, reason:assigned, repo:org/name"`. Don't gate basic search behind any new syntax — it's purely additive.

## Resolved Questions

- **Accent color:** Prototype both **electric coral (`#FF4F40`)** and **chartreuse (`#A6FF00`)** as switchable token sets in the design tokens. Define `--color-accent` and all accent variants under two token alternate classes (e.g., `[data-accent="coral"]` and `[data-accent="chartreuse"]`) so we can visually gut-check both on real UI before committing. Final decision after initial implementation.
- **Font hosting:** **Self-hosted** in `public/fonts/`. Download DM Sans (400, 500, 600, 700) and JetBrains Mono (400, 700) as WOFF2 files. Define `@font-face` rules in `src/index.css`. No external CDN dependency.
- **Combobox component:** **Replace `@reach/combobox` with a custom implementation.** `@reach/combobox` (v0.18) is unmaintained (Reach UI development stopped in 2023). Rather than pulling in another dependency, build a lightweight custom combobox using native `<input>` + `<ul>` with keyboard navigation (arrow keys, enter, escape), filtering, and ARIA attributes (`role="combobox"`, `aria-expanded`, `aria-activedescendant`, `role="listbox"`, `role="option"`). The current usage is simple — text input with filtered dropdown + select — and doesn't need a library. This removes the `@reach/combobox` dependency and its imported CSS, giving us full token-based styling control.
