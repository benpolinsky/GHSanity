## ADDED Requirements

### Requirement: Single-column layout with fixed toolbar

The system SHALL render a single-column layout with a fixed top toolbar and a scrollable main content area below. The current three-column flex layout (settings icon + filter sidebar + notification list) SHALL be replaced.

#### Scenario: Toolbar is fixed at top

- **WHEN** the app renders
- **THEN** a toolbar region SHALL be fixed at the top of the viewport, remaining visible during content scrolling

#### Scenario: Main content fills remaining viewport

- **WHEN** the app renders
- **THEN** the notification list area SHALL fill the remaining viewport height below the toolbar and scroll independently

#### Scenario: No sidebar

- **WHEN** the app renders
- **THEN** there SHALL be no left-side sidebar column — all filters and controls SHALL be in the toolbar or overlays

### Requirement: Toolbar composition

The toolbar SHALL contain three regions: left (app identity), center (filter controls), and right (global actions and settings).

#### Scenario: Toolbar left region

- **WHEN** the toolbar renders
- **THEN** the left region SHALL display the app name or a compact identity mark

#### Scenario: Toolbar center region

- **WHEN** the toolbar renders
- **THEN** the center region SHALL contain the filter bar component (type segments, reason pills, state/draft controls)

#### Scenario: Toolbar right region

- **WHEN** the toolbar renders
- **THEN** the right region SHALL contain the total notification count and the settings gear icon

### Requirement: App component restructure

`App.tsx` SHALL render the new layout shell: `<Toolbar />` containing `<FilterBar />`, then `<NotificationList />` as the main content, with `<SettingsPanel />` and `<CommandPalette />` as overlay components.

#### Scenario: Component hierarchy

- **WHEN** `App.tsx` renders
- **THEN** the rendered structure SHALL be: toolbar (with filter bar, actions, settings trigger) → main scrollable content (notification list) → overlay portals (settings panel, command palette, bulk action bar)

#### Scenario: Overlay stacking

- **WHEN** the settings panel or command palette is open
- **THEN** it SHALL render above the main content via a portal with appropriate z-index layering, and the main content SHALL remain in place behind it
