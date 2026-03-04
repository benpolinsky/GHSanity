## ADDED Requirements

### Requirement: Command palette styled with tokens

The command palette (Cmd+K) SHALL be restyled using design tokens — dark elevated surface, token-based colors, consistent typography.

#### Scenario: Palette surface

- **WHEN** the command palette opens
- **THEN** it SHALL render with `--color-bg-surface-3` background, `--color-border-default` border, and `--shadow-lg` elevation

#### Scenario: Input styling

- **WHEN** the palette input renders
- **THEN** it SHALL use `--font-mono` font family, `--color-bg-surface-2` background, `--color-fg-primary` text, and `--color-border-subtle` border

#### Scenario: Result item styling

- **WHEN** search results render
- **THEN** each result SHALL display the notification type icon, title in `--font-sans`, and repo name in `--font-mono` at `--text-sm` size

### Requirement: Filter command syntax

The command palette SHALL support filter prefix commands that apply filters instead of searching.

#### Scenario: Type filter command

- **WHEN** the user types `type:pr` in the palette
- **THEN** the system SHALL dispatch `SET_FILTER` with `"PullRequest"` and close the palette

#### Scenario: Reason filter command

- **WHEN** the user types `reason:assigned` in the palette
- **THEN** the system SHALL dispatch `SET_REASON_FILTER` with `"assign"` and close the palette

#### Scenario: Unknown prefix falls through to search

- **WHEN** the user types text that does not match a known command prefix
- **THEN** the system SHALL perform a Fuse.js search as it does currently

### Requirement: Repo navigation command

The command palette SHALL support `repo:` prefix to jump to a specific repo group in the notification list.

#### Scenario: Repo jump

- **WHEN** the user types `repo:org/name` in the palette
- **THEN** the system SHALL scroll the notification list to the matching repo group header and close the palette

#### Scenario: Repo prefix autocomplete

- **WHEN** the user types `repo:` followed by partial text
- **THEN** the palette results SHALL show matching repo names from the current notifications

### Requirement: Command palette hint

The palette SHALL show a discoverable hint about available commands.

#### Scenario: Hint display

- **WHEN** the command palette is open and the input is empty
- **THEN** a hint row SHALL display at the bottom: `"Try: type:pr, reason:assigned, repo:org/name"`

#### Scenario: Hint hides on typing

- **WHEN** the user starts typing in the palette
- **THEN** the hint row SHALL be hidden, replaced by search results

### Requirement: Keyboard navigation in results

The command palette results SHALL be fully keyboard-navigable.

#### Scenario: Arrow key navigation

- **WHEN** the palette has results and the user presses arrow down/up
- **THEN** the highlighted result SHALL move down/up accordingly with a visible focus indicator

#### Scenario: Enter to select

- **WHEN** a result is highlighted and the user presses Enter
- **THEN** the system SHALL open that notification's URL in a new tab and close the palette

#### Scenario: Escape to close

- **WHEN** the palette is open and the user presses Escape
- **THEN** the palette SHALL close and focus SHALL return to the main content

### Requirement: Palette open animation

The command palette SHALL animate when opening.

#### Scenario: Open transition

- **WHEN** the user presses Cmd+K
- **THEN** the palette overlay SHALL fade in and the palette container SHALL scale from ~98% to 100% with opacity 0→1 over ~200ms
