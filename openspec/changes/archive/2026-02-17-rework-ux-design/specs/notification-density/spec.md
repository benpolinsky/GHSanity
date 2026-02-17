## ADDED Requirements

### Requirement: Compact notification rows

Each notification item SHALL render as a single horizontal row with all key metadata visible inline, targeting ~32-36px row height.

#### Scenario: Row content layout

- **WHEN** a notification renders
- **THEN** the row SHALL display, left to right: checkbox, type icon, title (flex-grow, truncated with ellipsis), labels (compact chips, max 2 visible + overflow count), state badge, and quick-action button

#### Scenario: Row height target

- **WHEN** notification rows render
- **THEN** each row SHALL be between 32px and 36px in height, allowing 20+ notifications visible without scrolling on a standard 1080px viewport

#### Scenario: Title truncation

- **WHEN** a notification title exceeds available horizontal space
- **THEN** the title SHALL truncate with an ellipsis and the full title SHALL be available via the `title` attribute (native tooltip)

### Requirement: Type icon visual weight

Notification type icons SHALL use color to convey both type and state at a glance.

#### Scenario: PR icon colors

- **WHEN** a PullRequest notification renders
- **THEN** the type icon SHALL be green for open, purple for merged, red for closed, and gray for draft

#### Scenario: Issue icon colors

- **WHEN** an Issue notification renders
- **THEN** the type icon SHALL be green for open and red for closed (matching GitHub conventions)

#### Scenario: Icon size

- **WHEN** type icons render
- **THEN** they SHALL be 14-16px, sized to fit within the compact row without adding vertical padding

### Requirement: Label display

Labels SHALL render as compact colored chips inline with the notification row.

#### Scenario: Label overflow

- **WHEN** a notification has more than 2 labels
- **THEN** the first 2 labels SHALL be displayed as chips and remaining labels SHALL be indicated by a "+N" overflow badge

#### Scenario: Label chip styling

- **WHEN** a label chip renders
- **THEN** it SHALL use the label's color as a subtle background tint with readable text, sized at `--text-xs`

### Requirement: State badge

Each notification row SHALL display a state badge indicating its current state.

#### Scenario: State badge renders

- **WHEN** a notification renders
- **THEN** a compact badge SHALL display the state ("open", "closed", "draft") using the corresponding `--color-state-*` token color

#### Scenario: Draft badge distinction

- **WHEN** a notification is a draft
- **THEN** the state badge SHALL display "draft" with the warning/draft state color

### Requirement: Compact repo group headers

Notifications grouped by repository SHALL have a compact divider-style header row — not a large heading.

#### Scenario: Repo header content

- **WHEN** a repo group renders
- **THEN** the header SHALL display the repo full name in monospace font, a notification count in parentheses, and a "Select All" / "Deselect All" toggle — all in a single compact row

#### Scenario: Repo header styling

- **WHEN** a repo group header renders
- **THEN** it SHALL use a slightly elevated background (`--color-bg-surface-2`), be visually distinct from notification rows but not dominate the visual hierarchy (no `<h2>` styling)

#### Scenario: Repo name links to GitHub

- **WHEN** a user clicks the repo name in the group header
- **THEN** the system SHALL open the repository on GitHub in a new tab

### Requirement: Hover quick actions

Individual notification actions SHALL be discoverable via hover.

#### Scenario: Mark-as-read on hover

- **WHEN** a user hovers over a notification row
- **THEN** the quick-action check icon SHALL become visually prominent (accent color or increased opacity)

#### Scenario: Notification link on title

- **WHEN** a user clicks the notification title
- **THEN** the system SHALL open the notification's GitHub URL in a new tab and mark it as read internally

### Requirement: Row enter animation

Notification rows SHALL animate in when the list first loads or when filters change.

#### Scenario: Staggered row reveal

- **WHEN** notification rows appear (initial load or filter change)
- **THEN** rows SHALL animate in with `opacity 0→1` and `translateY 4px→0` over 200ms, with staggered `animation-delay` for the first 10 rows

#### Scenario: Done state animation

- **WHEN** a notification is marked as read/done
- **THEN** the row SHALL transition to 60% opacity over 300ms and apply a line-through on the title
