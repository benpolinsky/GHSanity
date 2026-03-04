## ADDED Requirements

### Requirement: Local SQLite FTS service
The system SHALL provide an optional local SQLite adapter that exposes `/search/index`, `/search/query`, and `/search/status` endpoints backed by SQLite FTS5, adhering to the SearchIndex contract.

#### Scenario: SQLite adapter serves queries
- **WHEN** configuration selects the SQLite adapter and `/search/query` is called with a query and filters
- **THEN** the service SHALL return ranked results consistent with the SearchIndex contract (id, fields, scores, snippets)

### Requirement: Schema with FTS synchronization
The SQLite adapter SHALL maintain a `threads` table and a `threads_fts` virtual table with triggers to keep FTS content synchronized on insert/update/delete.

#### Scenario: Upsert updates FTS
- **WHEN** a thread document is upserted via `/search/index`
- **THEN** the corresponding FTS entry SHALL be inserted or updated to reflect the latest content

### Requirement: Fallback to browser adapter on failure
If the SQLite service is unreachable or returns errors, the system SHALL fall back to the browser adapter for search queries.

#### Scenario: Service unreachable fallback
- **WHEN** a search request fails to reach the SQLite service
- **THEN** the UI SHALL retry using the browser adapter and still return search results