## ADDED Requirements

### Requirement: Unified search adapter contract
The system SHALL expose a `SearchIndex` contract with `indexThreads`, `search`, and `status` methods, and accept `ThreadDoc` objects containing id, repo, type, title, body, commentsText, labels, state, draft, reason, updatedAt, unread, url, and optional ranking hints.

#### Scenario: Adapter methods available
- **WHEN** the UI initializes search
- **THEN** it SHALL obtain an adapter exposing `indexThreads`, `search`, and `status` as defined by the contract

#### Scenario: ThreadDoc shape enforced
- **WHEN** a thread is indexed
- **THEN** the adapter SHALL accept the full ThreadDoc shape (id, repo, type, title, body, commentsText, labels, state, draft, reason, updatedAt, unread, url, optional ranking hints)

### Requirement: Adapter swap without UI changes
The system SHALL allow swapping between browser and SQLite adapters via configuration without modifying search consumers.

#### Scenario: Browser adapter selection
- **WHEN** configuration selects the browser adapter
- **THEN** `search` results SHALL honor the contract (fields, filters, ranking) without UI changes

#### Scenario: SQLite adapter selection
- **WHEN** configuration selects the SQLite adapter
- **THEN** `search` results SHALL honor the contract (fields, filters, ranking) without UI changes