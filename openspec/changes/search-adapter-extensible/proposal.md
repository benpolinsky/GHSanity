## Why

Users need to search the full context of notifications (issue/PR descriptions and comments) rather than just titles. The current in-memory Fuse search cannot see bodies or discussions and cannot swap to heavier local indexing (e.g., SQLite FTS) if needed.

## What Changes

- Add a pluggable search index interface so the UI can swap between a browser FTS adapter and a local SQLite FTS adapter without changing the palette or filters.
- Extend the notification fetch pipeline to hydrate issue/PR bodies and comments (issue comments, PR review comments) with rate-limit-aware batching and ETags.
- Build a browser-based FTS adapter (IndexedDB + in-memory index) that indexes titles, bodies, comments, labels, repo, type, state, and reasons, powering the command palette/search UI.
- Optionally support a local SQLite FTS adapter (via a local API route/process) using the same document contract for richer ranking/snippets.

## Capabilities

### New Capabilities
- `search-adapter-interface`: Defines the search index contract (indexing, querying, status) decoupled from UI/search surfaces.
- `thread-full-text-indexing`: Indexes notification threads with title, body, labels, state, repo, and aggregated comments; supports relevance boosts and filters.
- `discussion-hydration-pipeline`: Fetches and caches issue/PR bodies and comments with pagination, ETag reuse, and concurrency caps to protect GitHub API limits.
- `local-sqlite-fts` (optional): Local service/API that stores threads in SQLite with FTS and serves search results using the shared contract.

### Modified Capabilities
- None.

## Impact

- Affects command palette search plumbing and any search consumers; introduces new shared search/indexing module(s).
- Adds data-fetching for bodies/comments (GitHub API calls) with caching/ETag handling; touches notification hydration flow.
- New dependencies likely: browser FTS/indexing lib (e.g., MiniSearch/Lunr), IndexedDB helper, and optionally SQLite/FTS5 for the local adapter.
- No backend/cloud services; optional local service runs on developer machine only.
