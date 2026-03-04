## ADDED Requirements

### Requirement: Indexes full thread content and metadata
The system SHALL index each notification thread with title, body, aggregated commentsText, repo, type, labels, state, draft, reason, unread flag, updatedAt, and url.

#### Scenario: Comment match returns thread
- **WHEN** a search query matches text contained only in a comment of a thread
- **THEN** the thread SHALL appear in results with its thread id

#### Scenario: Repo/type/state filters applied
- **WHEN** filters include repo, type, state, or draft
- **THEN** the returned results SHALL be limited to threads matching those filters

### Requirement: Relevance weighting
The system SHALL rank matches weighting fields in this order: title highest, then labels/repo/type, then body, then commentsText; unread threads and prioritized repos SHALL receive a score boost; more recent threads SHALL receive a recency boost.

#### Scenario: Title match outranks body match
- **WHEN** two threads match a query, one in title and one only in body
- **THEN** the title match SHALL rank above the body-only match

#### Scenario: Unread boost applied
- **WHEN** two otherwise identical matches differ only by unread flag
- **THEN** the unread thread SHALL rank above the read thread