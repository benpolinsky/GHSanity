## ADDED Requirements

### Requirement: Always hydrate bodies and comments
The system SHALL fetch and cache issue/PR bodies and all associated comments (issue comments and PR review comments) for every notification thread.

#### Scenario: Thread hydration on receipt
- **WHEN** a notification thread is fetched
- **THEN** the system SHALL fetch its body and all comments and cache them for indexing

### Requirement: Rate-aware batching with conservative cap
The system SHALL batch hydration using `per_page=100`, paginate, cap concurrent outbound requests at 3, and enforce a conservative per-session request cap of 200; upon reaching the cap it SHALL stop further hydration and mark status as partial.

#### Scenario: Concurrency limit respected
- **WHEN** hydration runs
- **THEN** no more than 3 GitHub requests SHALL be in flight concurrently

#### Scenario: Session cap honored
- **WHEN** hydration reaches 200 GitHub requests in a session
- **THEN** it SHALL halt further hydration and report partial status

### Requirement: Conditional requests with ETag reuse
The system SHALL store and reuse ETag headers for bodies and comments, issuing conditional requests and skipping re-download when content is unchanged.

#### Scenario: ETag prevents refetch
- **WHEN** a thread body or comment set is unchanged since last hydration
- **THEN** the conditional request SHALL avoid re-downloading the content

### Requirement: Retention until manual clear
The system SHALL retain hydrated bodies and comments indefinitely until the user triggers a manual clear action.

#### Scenario: Manual clear removes cached discussions
- **WHEN** the user triggers cache clear
- **THEN** all stored bodies and comments SHALL be removed and rehydrated on next fetch