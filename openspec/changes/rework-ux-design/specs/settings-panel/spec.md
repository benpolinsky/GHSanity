## ADDED Requirements

### Requirement: Right-side slide-out panel

The settings pane SHALL render as a 320px-wide panel that slides in from the right edge of the viewport, replacing the current full-viewport modal overlay.

#### Scenario: Panel opens on gear icon click

- **WHEN** a user clicks the settings gear icon
- **THEN** the settings panel SHALL slide in from the right with a `translateX` transition over ~250ms ease-out, and a semi-transparent backdrop SHALL fade in behind it

#### Scenario: Panel closes on escape key

- **WHEN** the settings panel is open and the user presses Escape
- **THEN** the panel SHALL slide out to the right and the backdrop SHALL fade out

#### Scenario: Panel closes on backdrop click

- **WHEN** the settings panel is open and the user clicks the backdrop overlay
- **THEN** the panel SHALL close with the slide-out animation

#### Scenario: Main content remains visible

- **WHEN** the settings panel is open
- **THEN** the notification list SHALL remain partially visible behind the backdrop, maintaining spatial context

### Requirement: Structured panel sections

The settings panel SHALL organize its content into clearly labeled sections with visual dividers.

#### Scenario: Section structure

- **WHEN** the settings panel renders
- **THEN** it SHALL contain three sections in order: "Label Exclusions" (label filter), "Repo Prioritization" (repo ordering), and "API Rate Limit" (rate info)

#### Scenario: Section headers

- **WHEN** a settings section renders
- **THEN** it SHALL have a text header using `--text-md` size and `--weight-semibold`, with a subtle bottom border as a divider

### Requirement: Custom combobox replaces @reach/combobox

The label exclusion and repo prioritization comboboxes SHALL use a custom implementation, removing the `@reach/combobox` dependency.

#### Scenario: Combobox keyboard navigation

- **WHEN** the combobox input is focused and the dropdown is open
- **THEN** the user SHALL be able to navigate options with arrow keys, select with Enter, and close with Escape

#### Scenario: Combobox filtering

- **WHEN** the user types in the combobox input
- **THEN** the dropdown options SHALL filter to match the input text (case-insensitive)

#### Scenario: Combobox ARIA attributes

- **WHEN** the combobox renders
- **THEN** it SHALL include `role="combobox"`, `aria-expanded`, `aria-activedescendant` on the input, and `role="listbox"` with `role="option"` on the dropdown items

#### Scenario: Combobox styled with tokens

- **WHEN** the combobox renders
- **THEN** all colors, spacing, borders, and typography SHALL use design token CSS variables — no imported third-party CSS

### Requirement: Rate limit progress bar

The API rate limit display SHALL render as a visual progress bar instead of raw text values.

#### Scenario: Progress bar display

- **WHEN** the rate limit section renders
- **THEN** it SHALL display a horizontal progress bar showing remaining/total, with the numeric values displayed alongside (e.g., "42/60")

#### Scenario: Progress bar color

- **WHEN** remaining rate limit is above 50%
- **THEN** the bar fill SHALL use the success/open state color
- **WHEN** remaining rate limit is between 20% and 50%
- **THEN** the bar fill SHALL use the warning/draft state color
- **WHEN** remaining rate limit is below 20%
- **THEN** the bar fill SHALL use the danger/closed state color

### Requirement: Panel body scroll prevention

The settings panel SHALL prevent body scroll when open.

#### Scenario: Body scroll locked

- **WHEN** the settings panel is open
- **THEN** `document.body.style.overflow` SHALL be set to `"hidden"` and restored when the panel closes
