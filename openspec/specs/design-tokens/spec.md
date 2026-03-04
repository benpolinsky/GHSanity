## ADDED Requirements

### Requirement: Token definition layer

The system SHALL define all visual tokens as CSS custom properties on `:root` in `src/index.css`. No component CSS Module file SHALL contain hardcoded color, spacing, font, radius, shadow, or transition values — all values MUST reference token variables.

#### Scenario: Token categories are complete

- **WHEN** the token system is defined
- **THEN** the following token categories SHALL exist: `--color-bg-*` (backgrounds), `--color-fg-*` (text), `--color-accent-*` (accent and variants), `--color-border-*` (borders), `--color-state-*` (semantic states), `--space-*` (spacing scale), `--radius-*` (border radii), `--font-*` (font families), `--text-*` (font sizes), `--weight-*` (font weights), `--shadow-*` (shadows), `--transition-*` (timing)

#### Scenario: No hardcoded values in component styles

- **WHEN** any `.module.css` file is inspected
- **THEN** all color, spacing, font-size, font-family, border-radius, box-shadow, and transition values SHALL reference `var(--token-name)` instead of raw values

### Requirement: Dark-mode-first color palette

The system SHALL define a dark-mode-first color palette with a near-black base (`#0a0a0b` range), layered gray surfaces for elevation, and a high-saturation accent color.

#### Scenario: Base surface hierarchy

- **WHEN** the color tokens are defined
- **THEN** there SHALL be at least 3 surface levels: base (app background), surface-1 (cards/lists), surface-2 (elevated elements like toolbars), and surface-3 (overlays like panels and modals), each progressively lighter

#### Scenario: Accent color prototyping

- **WHEN** the accent tokens are defined
- **THEN** both electric coral (`#FF4F40` range) and chartreuse (`#A6FF00` range) SHALL be available as switchable accent sets via `[data-accent="coral"]` and `[data-accent="chartreuse"]` attribute selectors on the root element

#### Scenario: State colors align with GitHub conventions

- **WHEN** state color tokens are defined
- **THEN** open/success SHALL be green, closed/danger SHALL be red, draft/warning SHALL be amber, and info SHALL be blue

### Requirement: Typography tokens

The system SHALL define typography using self-hosted DM Sans (sans-serif) and JetBrains Mono (monospace) fonts loaded from `public/fonts/` via `@font-face` rules.

#### Scenario: Font files are self-hosted

- **WHEN** the app loads
- **THEN** DM Sans (weights 400, 500, 600, 700) and JetBrains Mono (weights 400, 700) SHALL be loaded from WOFF2 files in `public/fonts/` with `font-display: swap`

#### Scenario: Font family tokens

- **WHEN** the font tokens are defined
- **THEN** `--font-sans` SHALL resolve to `'DM Sans', system-ui, sans-serif` and `--font-mono` SHALL resolve to `'JetBrains Mono', 'Cascadia Code', monospace`

#### Scenario: Type scale

- **WHEN** the text size tokens are defined
- **THEN** sizes SHALL range from `--text-xs` (0.75rem) through `--text-xl` (1.571rem) with the base size at 1rem (14px root)

### Requirement: Spacing scale

The system SHALL define a spacing scale as CSS custom properties following an exponential progression.

#### Scenario: Scale values

- **WHEN** spacing tokens are defined
- **THEN** the scale SHALL include at minimum: `--space-2xs` (2px), `--space-xs` (4px), `--space-sm` (6px), `--space-md` (8px), `--space-lg` (12px), `--space-xl` (16px), `--space-2xl` (24px), `--space-3xl` (32px)

### Requirement: Subtle noise texture

The system SHALL apply a subtle noise/grain texture to the base app background for depth.

#### Scenario: Noise is applied

- **WHEN** the app background renders
- **THEN** a low-opacity (3-5%) noise texture SHALL be visible on the base background, implemented via CSS (SVG filter or base64 PNG) without an external image request

#### Scenario: Noise does not affect performance

- **WHEN** the noise texture is applied
- **THEN** it SHALL not cause visible rendering jank or increase page load time beyond 10ms
