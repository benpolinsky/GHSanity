## 1. Foundation: Design Tokens & Fonts

- [x] 1.1 Download DM Sans (400, 500, 600, 700) WOFF2 files and place in `public/fonts/`
- [x] 1.2 Download JetBrains Mono (400, 700) WOFF2 files and place in `public/fonts/`
- [x] 1.3 Rewrite `src/index.css`: add `@font-face` rules for both fonts, define all CSS custom property tokens on `:root` (color-bg, color-fg, color-accent, color-border, color-state, space, radius, font, text, weight, shadow, transition)
- [x] 1.4 Add dual accent token sets: `[data-accent="coral"]` and `[data-accent="chartreuse"]` with full accent variant overrides
- [x] 1.5 Add noise texture to body background via CSS (SVG filter or base64 PNG at 3-5% opacity)
- [x] 1.6 Add font preload `<link>` tags in `src/app/layout.tsx` for DM Sans and JetBrains Mono
- [x] 1.7 Remove `@reach/combobox` from `package.json` and run `pnpm install`

## 2. Layout Shell & App Restructure

- [x] 2.1 Create `src/components/Toolbar.tsx` and `src/components/Toolbar.module.css` — fixed top bar with left (app identity), center (filter bar slot), and right (notification count, settings gear) regions
- [x] 2.2 Rewrite `src/components/App.tsx` to render new layout: `<Toolbar>` (containing `<FilterBar />`), `<main>` (scrollable, containing `<NotificationList />`), overlay portals (`<SettingsPane />`, `<CommandPalette />`)
- [x] 2.3 Rewrite `src/components/App.module.css` to use tokens: single-column layout, fixed toolbar, scrollable main content area, remove old 3-column flex styles and sidebar references

## 3. Filter Bar

- [x] 3.1 Create `src/components/filters/FilterBar.tsx` and `FilterBar.module.css` — horizontal container for all filter groups, replaces `Filters.tsx`
- [x] 3.2 Rewrite `src/components/filters/NotificationTypeFilter.tsx` as `TypeSegments.tsx` — segmented control with count badges per type (All, PRs, Issues, Releases), accent background on active, dispatches `SET_FILTER`
- [x] 3.3 Create `src/components/filters/TypeSegments.module.css` with token-based styles (replace `NotificationTypeFilter.module.css`)
- [x] 3.4 Rewrite `src/components/filters/ReasonFilters.tsx` as `ReasonPills.tsx` — toggleable pills with counts, accent border + muted accent background on active, dispatches `SET_REASON_FILTER`
- [x] 3.5 Create `src/components/filters/ReasonPills.module.css` with token-based styles (replace `ReasonFilters.module.css`)
- [x] 3.6 Combine `StateFilter.tsx` and `DraftFilter.tsx` into `StateControls.tsx` — segmented control (All/Open/Closed) + toggle switch for drafts, dispatches `SET_STATE_FILTER` and `TOGGLE_DRAFT_FILTER`
- [x] 3.7 Create `src/components/filters/StateControls.module.css` with token-based styles
- [x] 3.8 Delete old filter files: `Filters.tsx`, `NotificationTypeFilter.module.css`, `ReasonFilters.module.css`, `StateFilter.tsx`, `DraftFilter.tsx`
- [x] 3.9 Add CSS transitions (~150ms) on filter segment/pill background-color and color changes

## 4. Notification List & Item Density

- [x] 4.1 Rewrite `src/components/notifications/NotificationList.tsx` — remove top-level globalActions (Select All / Mark Selected as Read buttons), keep repo grouping and filtering logic, add staggered row-enter animation classes
- [x] 4.2 Restyle repo group headers: compact divider row with monospace repo name, count, and Select All toggle — replace `<h2>` with a styled div using `--color-bg-surface-2`
- [x] 4.3 Rewrite `src/components/notifications/NotificationItem.tsx` — single-row layout: checkbox → type icon (14-16px) → title (truncated, `title` attr) → labels (max 2 + overflow) → state badge → quick-action check button
- [x] 4.4 Update `src/components/notifications/Labels.tsx` — compact chips at `--text-xs`, max 2 visible with "+N" overflow badge, label color as subtle background tint
- [x] 4.5 Update `src/components/notifications/NotificationTypeIcon.tsx` — color-coded by type+state: PR open=green, merged=purple, closed=red, draft=gray; Issue open=green, closed=red. Size 14-16px.
- [x] 4.6 Rewrite `src/components/notifications/NotificationList.module.css` with tokens: 32-36px row height, row-enter keyframe animation with stagger, done-state opacity transition, hover quick-action emphasis
- [x] 4.7 Add `@keyframes rowEnter` (opacity 0→1, translateY 4px→0) and staggered `animation-delay` for first 10 rows

## 5. Bulk Action Bar

- [x] 5.1 Create `src/components/BulkActionBar.tsx` and `BulkActionBar.module.css` — fixed bottom bar, shows when `selectedNotifications.size > 0`, displays count + "Mark as Read" + "Deselect All" buttons
- [x] 5.2 Style with accent background, high-contrast text, `translateY` slide-up transition (~200ms)
- [x] 5.3 Lift `selectedNotifications` state and selection handlers from `NotificationList.tsx` into a shared location accessible by both `NotificationList` and `BulkActionBar` (either lift to `App.tsx` or use a ref/callback pattern)
- [x] 5.4 Add selection count display to toolbar right region (alongside total notification count)

## 6. Settings Panel

- [x] 6.1 Rewrite `src/components/settings/SettingsPane.tsx` — right-side slide-out panel (320px), `translateX` open/close animation (~250ms), backdrop with fade, Escape and backdrop-click to close
- [x] 6.2 Rewrite `src/components/settings/SettingsPane.module.css` with tokens: panel surface `--color-bg-surface-3`, section headers with `--text-md` and `--weight-semibold`, subtle dividers
- [x] 6.3 Build custom combobox component `src/components/Combobox.tsx` and `Combobox.module.css` — native `<input>` + `<ul>` with arrow key nav, Enter select, Escape close, case-insensitive filtering, ARIA attributes (`role="combobox"`, `aria-expanded`, `aria-activedescendant`, `role="listbox"`, `role="option"`)
- [x] 6.4 Update `src/components/settings/LabelFilter.tsx` to use new custom Combobox, remove `@reach/combobox` import
- [x] 6.5 Update `src/components/settings/RepoPrioritization.tsx` to use new custom Combobox, remove `@reach/combobox` import
- [x] 6.6 Rewrite `src/components/settings/LabelFilter.module.css` with tokens
- [x] 6.7 Rewrite `src/components/RateLimit.tsx` — progress bar display with color thresholds (green >50%, amber 20-50%, red <20%), numeric value alongside
- [x] 6.8 Restyle `src/components/Token.tsx` and `Token.module.css` with tokens
- [x] 6.9 Restyle `src/components/TokenContainer.tsx` with tokens
- [x] 6.10 Delete `src/components/ComboboxContainer.tsx`, `ComboboxContainer.module.css`, and remove `@reach/combobox/styles.css` imports

## 7. Command Palette

- [x] 7.1 Restyle `src/components/CommandPalette.tsx` — surface-3 background, token-based borders/shadows, monospace input, result items with type icon + title (`--font-sans`) + repo (`--font-mono`)
- [x] 7.2 Rewrite `src/components/CommandPalette.module.css` with tokens: palette open animation (scale 98%→100%, opacity 0→1 over 200ms)
- [x] 7.3 Add command prefix parser: detect `type:`, `reason:`, `repo:` prefixes before falling through to Fuse.js search
- [x] 7.4 Implement `type:` commands — map `type:pr` → `SET_FILTER` with `"PullRequest"`, `type:issue` → `"Issue"`, `type:release` → `"Release"`, close palette after dispatch
- [x] 7.5 Implement `reason:` commands — map `reason:assigned` → `SET_REASON_FILTER` with `"assign"`, `reason:participating`, `reason:mentioned`, `reason:team`, `reason:review` → corresponding values
- [x] 7.6 Implement `repo:` navigation — filter matching repo names, scroll to repo group header on select, close palette
- [x] 7.7 Add hint row at bottom when input is empty: `"Try: type:pr, reason:assigned, repo:org/name"` — hide on typing
- [x] 7.8 Add keyboard navigation: arrow up/down to move through results, Enter to select, visible focus indicator on highlighted result

## 8. Cleanup & Verification

- [x] 8.1 Audit all `.module.css` files for any remaining hardcoded color/spacing/font values — replace with token references
- [x] 8.2 Remove old files: `Filters.tsx`, old filter CSS modules, `ComboboxContainer.tsx`, `ComboboxContainer.module.css`
- [x] 8.3 Verify `data-accent="coral"` and `data-accent="chartreuse"` both render correctly — visually inspect filters, action bar, active states, command palette
- [x] 8.4 Test filter dispatching: all type/reason/state/draft filters still work with existing reducer actions
- [x] 8.5 Test bulk actions: select notifications, verify bulk action bar appears, mark as read works, deselect clears
- [x] 8.6 Test settings panel: open/close animations, label exclusion combobox, repo prioritization combobox, rate limit progress bar
- [x] 8.7 Test command palette: search still works, `type:`, `reason:`, `repo:` commands work, keyboard navigation works
- [x] 8.8 Run `pnpm build` to verify no TypeScript or build errors
- [x] 8.9 Run `pnpm lint` and `pnpm prettier` to verify code quality
