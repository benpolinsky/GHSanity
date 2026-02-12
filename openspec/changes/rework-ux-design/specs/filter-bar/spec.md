## ADDED Requirements

### Requirement: Horizontal filter bar replaces sidebar

The filter UI SHALL be a horizontal bar embedded in the toolbar, replacing the current vertical sidebar column. It SHALL contain three filter groups: type segments, reason pills, and state/draft controls.

#### Scenario: Filter bar renders in toolbar

- **WHEN** the app renders
- **THEN** all filter controls SHALL appear horizontally within the toolbar — not in a sidebar, not below the toolbar, not in a separate row

#### Scenario: No vertical filter sidebar exists

- **WHEN** the app renders
- **THEN** the `filtersContainer` sidebar column SHALL not exist in the DOM

### Requirement: Notification type segmented control

The notification type filter SHALL render as a segmented control (pill group) with options: All, PRs, Issues, Releases. Each segment SHALL display a count badge.

#### Scenario: Type segments render with counts

- **WHEN** notifications are loaded
- **THEN** each type segment SHALL display the count of notifications matching that type (e.g., "PRs (12)")

#### Scenario: Active type segment styling

- **WHEN** a type segment is selected
- **THEN** it SHALL have an accent-colored background and foreground text, visually distinguishing it from inactive segments

#### Scenario: Type filter dispatches existing action

- **WHEN** a user clicks a type segment
- **THEN** the system SHALL dispatch `SET_FILTER` with the corresponding `NotificationType` value (or `null` for "All")

### Requirement: Reason filter pills

The reason filter SHALL render as toggleable pills/chips: Assigned, Participating, Mentioned, Team, Review Requested. Each pill SHALL display its count.

#### Scenario: Reason pills render with counts

- **WHEN** notifications are loaded
- **THEN** each reason pill SHALL display the count of notifications matching that reason

#### Scenario: Active reason pill styling

- **WHEN** a reason pill is active
- **THEN** it SHALL have an accent-colored border and a muted accent background

#### Scenario: Reason filter dispatches existing action

- **WHEN** a user clicks a reason pill
- **THEN** the system SHALL dispatch `SET_REASON_FILTER` with the corresponding `ReasonFilter` value (or `null` to clear)

### Requirement: State and draft controls

The state filter SHALL render as a small segmented control (All, Open, Closed). The draft filter SHALL render as a toggle switch.

#### Scenario: State control dispatches existing action

- **WHEN** a user clicks a state segment
- **THEN** the system SHALL dispatch `SET_STATE_FILTER` with the value `"all"`, `"open"`, or `"closed"`

#### Scenario: Draft toggle dispatches existing action

- **WHEN** a user toggles the draft switch
- **THEN** the system SHALL dispatch `TOGGLE_DRAFT_FILTER`

#### Scenario: State and draft controls replace select/checkbox

- **WHEN** the filter bar renders
- **THEN** the state filter SHALL be a segmented control (not a `<select>` dropdown) and the draft filter SHALL be a toggle switch (not a plain checkbox)

### Requirement: Filter transitions

All filter state changes SHALL animate with CSS transitions.

#### Scenario: Segment/pill activation animates

- **WHEN** a filter segment or pill becomes active or inactive
- **THEN** the background-color and color properties SHALL transition over ~150ms
