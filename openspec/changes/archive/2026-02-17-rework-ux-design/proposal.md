## Why

The current GH Sanity UI is functional but visually incomplete and structurally disjointed. Filters are stacked vertically in a narrow 80px left column—cramped, unlabeled, and disconnected from the content they control. The settings pane overrides to `min-width: 100vw` and `min-height: 50vh` with a flat black background—unstyled and jarring. Hardcoded hex values are scattered across a dozen CSS Module files with no shared token system, making consistent theming impossible. There's no typographic hierarchy beyond browser defaults, no spatial rhythm, and no cohesive visual language tying the pieces together. The app works, but it doesn't feel designed.

Now is the right time to fix this because the feature set has stabilized—filters, notifications, settings, command palette, bulk actions—and the component structure is sound. What's missing is a deliberate, unified design system underneath it all.

## What Changes

- **Introduce a design token system** via CSS custom properties: color palette (dark-mode-first with light-mode support), spacing scale, typography scale, border radii, shadows, and transition timing. All hardcoded values replaced.
- **Rework the layout architecture**: Replace the current flat `display: flex` three-column layout (settings icon + filter sidebar + notification list) with a purposeful information-dense layout—a compact top toolbar for filters and actions, with the notification list as the primary content area.
- **Redesign the filter UI**: Move filters from the awkward vertical sidebar into a horizontal filter bar or segmented control strip integrated into the main content header. Filters should feel like direct manipulation of the list, not a disconnected sidebar. Add visual counts/badges per filter.
- **Redesign the settings pane**: Replace the full-viewport black overlay with a well-structured slide-out panel or modal with clear sections, proper spacing, labeled groups, and visual hierarchy.
- **Redesign notification items for information density**: Tighten notification rows—repo grouping headers, inline metadata (reason, state, draft badge, labels), and bulk-action checkboxes should all be scannable at a glance. Notification type icons and state indicators need clearer visual weight.
- **Enhance bulk and individual actions**: Surface quick actions (mark as read, snooze, open in GitHub) more prominently. Bulk selection should have a persistent action bar when items are selected. Per-repo "select all" should be more discoverable.
- **Restyle the command palette**: Align with the new token-based theme. Tighter result items, better typography, keyboard navigation affordances.
- **Establish distinctive typography**: Replace Inter/system-ui with a characterful font pairing. The app is a developer tool—lean into a refined, utilitarian aesthetic with a distinctive display font for headings and a highly legible monospace or humanist sans for body/data.
- **Add purposeful motion**: Loading states, filter transitions, notification row enter/exit animations, and settings panel open/close transitions.
- **Expand the command palette**: The existing Cmd+K palette is the seed of a power-user navigation layer. Enhance it as a primary way to find, filter, and act on notifications—not just search. This reinforces the terminal-speed ethos.

## Aesthetic Direction

This section locks in the visual identity so the design artifact can execute with precision, per **frontend-design skill** requirements.

- **Tone: Modern dashboard** — clean, structured, data-forward. Think monitoring dashboards (Grafana, Linear, Vercel) rather than consumer apps. Precision over decoration. Every pixel earns its place.
- **Palette: Dark base + unexpected bold accent.** Near-black foundation (`#0a0a0b`-range), cool neutral grays for surfaces and borders, then a single high-saturation accent that _pops_ — electric coral, hot magenta, or vivid chartreuse. Not safe teal. Not muted blue. Something that makes the active states and CTAs unmissable against the dark canvas.
- **Typography: Readability-first sans-serif.** No novelty fonts. Choose a highly legible, modern sans-serif with good weight range and tabular figures for data — candidates like Geist, DM Sans, or Plus Jakarta Sans (NOT Inter, Roboto, or system defaults). Pair with a monospace for metadata/counts (Geist Mono, JetBrains Mono). Readability at small sizes is the priority — this is a scanning/triaging tool, not a magazine.
- **Texture: Subtle noise/grain** on dark surfaces to add depth. Fine 1px borders for structure. No gradients, no blur, no glassmorphism. The depth comes from layered surfaces at slightly different elevations, not from effects.
- **Spatial composition: Controlled density.** Tight rows, compact spacing, minimal padding waste. Information-dense like a terminal or spreadsheet, but with enough breathing room that nothing feels cramped. Every notification row should show type, title, repo, reason, state, labels, and actions without scrolling horizontally.
- **Memorable quality: Terminal-speed information access.** The defining experience is _speed_ — fast scanning via dense notification rows, fast filtering via the toolbar, fast action via bulk operations, and fast navigation via the command palette (Cmd+K). Multiple paths to the same information: visual filters for browsing, command palette for targeted search, keyboard shortcuts for power users. The UI should feel like an instrument you get fast at.

**IMPORTANT**: This change leverages the **frontend-design skill** for all visual implementation. Every component touched must follow the frontend-design skill's guidelines: modern dashboard aesthetic, readability-first sans-serif typography (no Inter/Roboto/Arial/system defaults), bold unexpected accent color on a dark base, cohesive color theming via CSS variables, purposeful motion, and controlled-density spatial composition. The goal is a UI that feels like a fast, precise instrument for triaging GitHub notifications — terminal-speed density with dashboard-grade polish.

## Capabilities

### New Capabilities

- `design-tokens`: CSS custom property system defining the complete visual language—color palette (dark/light), spacing scale, typography scale, radii, shadows, transitions. Single source of truth consumed by all components.
- `layout-shell`: Top-level app layout architecture—toolbar/header region, main content area, panel overlays. Replaces the current flat flex container.
- `filter-bar`: Horizontal filter UI integrated into the content header—notification type segments, reason filter pills, state/draft toggles—with live counts and active state indicators.
- `notification-density`: Redesigned notification list and item components for maximum scannable information density—tighter rows, inline metadata, clearer type/state iconography, improved bulk selection UX.
- `settings-panel`: Redesigned settings overlay—structured slide-out or modal with labeled sections, proper form controls, and visual hierarchy.
- `action-surfaces`: Bulk action bar (appears on selection), per-item quick actions, per-repo group actions—all surfaced prominently with clear affordances.
- `command-palette`: Enhanced Cmd+K palette as a primary navigation and action layer—search notifications, apply filters, trigger bulk actions, jump to repos. Restyled to match the new theme with keyboard-first UX.

### Modified Capabilities

<!-- No existing specs to modify — the openspec/specs/ directory is empty. All capabilities are new. -->

## Impact

- **Components affected**: Every component in `src/components/` will be restyled. `App.tsx` layout structure changes. `Filters.tsx` and its children restructured into a horizontal bar. `SettingsPane.tsx` rebuilt as a proper panel. `NotificationList.tsx` and `NotificationItem.tsx` redesigned for density. `CommandPalette.tsx` restyled.
- **CSS Modules**: All `.module.css` files will be rewritten to consume design tokens instead of hardcoded values. `src/index.css` becomes the token definition layer.
- **No API changes**: GitHub API integration, data fetching, and state management remain unchanged.
- **No reducer changes**: All existing actions and state shape stay the same. New UI state (e.g., selection bar visibility) may use local component state.
- **Dependencies**: May add a web font (Google Fonts or self-hosted) for typography. No new JS dependencies expected—CSS-only animations preferred.
- **Skill dependency**: All visual implementation work on this change MUST use the **frontend-design** skill to ensure distinctive, production-grade aesthetics. This is not optional—it's a core requirement of this change.
