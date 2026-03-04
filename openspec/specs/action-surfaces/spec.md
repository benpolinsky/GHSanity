## ADDED Requirements

### Requirement: Bulk action bar on selection

The system SHALL display a fixed-position action bar at the bottom of the viewport when one or more notifications are selected.

#### Scenario: Bar appears on selection

- **WHEN** the user selects one or more notifications via checkboxes
- **THEN** a bulk action bar SHALL slide up from the bottom of the viewport with a CSS `translateY` transition over ~200ms

#### Scenario: Bar disappears on deselection

- **WHEN** all notifications are deselected
- **THEN** the bulk action bar SHALL slide down and out of view

#### Scenario: Bar content

- **WHEN** the bulk action bar is visible
- **THEN** it SHALL display the selection count (e.g., "3 selected"), a "Mark as Read" button, and a "Deselect All" button

#### Scenario: Bar styling

- **WHEN** the bulk action bar renders
- **THEN** it SHALL use an accent-colored background to clearly indicate selection mode, with high-contrast text

### Requirement: Global select/deselect in toolbar

The "Select All" / "Deselect All" toggle for all visible notifications SHALL be accessible without scrolling.

#### Scenario: Global selection removed from notification list header

- **WHEN** the notification list renders
- **THEN** the top-level "Select All" / "Mark Selected as Read" buttons SHALL be removed from the notification list header — these functions move to the toolbar and bulk action bar

#### Scenario: Selection count in toolbar

- **WHEN** notifications are selected
- **THEN** the toolbar right region SHALL display the selection count alongside the total notification count

### Requirement: Per-repo group selection

Each repo group header SHALL include a toggle to select/deselect all notifications in that group.

#### Scenario: Per-repo select all

- **WHEN** a user clicks "Select All" on a repo group header
- **THEN** all notifications in that repo group SHALL become selected (checkboxes checked)

#### Scenario: Per-repo deselect all

- **WHEN** all notifications in a repo group are selected and the user clicks the toggle
- **THEN** all notifications in that repo group SHALL become deselected

#### Scenario: Toggle label reflects state

- **WHEN** the repo group selection toggle renders
- **THEN** it SHALL read "Select All" when not all are selected and "Deselect All" when all are selected

### Requirement: Per-item quick action visibility

Individual notification actions SHALL be visible on hover and always accessible.

#### Scenario: Mark-as-read button

- **WHEN** a notification row renders
- **THEN** the mark-as-read (check) button SHALL always be in the DOM but SHALL have reduced opacity when not hovered

#### Scenario: Hover emphasis

- **WHEN** the user hovers over a notification row
- **THEN** the mark-as-read button SHALL transition to full opacity and accent color over ~150ms

### Requirement: Bulk mark-as-read

The bulk action bar "Mark as Read" button SHALL call the GitHub API for each selected notification.

#### Scenario: Bulk mark triggers API calls

- **WHEN** the user clicks "Mark as Read" in the bulk action bar
- **THEN** the system SHALL call `markNotificationAsRead` for each selected notification ID in parallel

#### Scenario: Bulk mark success

- **WHEN** all API calls succeed
- **THEN** all selected notifications SHALL be marked as done (reduced opacity, strikethrough), the selection SHALL be cleared, and the bulk action bar SHALL hide

#### Scenario: Selection clears after bulk action

- **WHEN** the bulk mark-as-read completes
- **THEN** the selected notifications set SHALL be empty and all checkboxes SHALL be unchecked
