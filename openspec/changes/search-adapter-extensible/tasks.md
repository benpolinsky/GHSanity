## 1. Interfaces and Wiring

- [x] 1.1 Add `SearchIndex` and `ThreadDoc` types and adapter factory (config flag for browser/sqlite)
- [x] 1.2 Refactor command palette search to use `SearchIndex.search` and `status`
- [x] 1.3 Add adapter fallback logic (SQLite failure → browser)

## 2. Browser Adapter

- [x] 2.1 Add MiniSearch/Lunr (or chosen FTS) dependency
- [x] 2.2 Implement IndexedDB schema (docs/meta/etags) and startup load
- [x] 2.3 Build in-memory indexer with field boosts and unread/recency/repo boosts
- [x] 2.4 Implement `indexThreads`, `search` (filters/snippets), `status`

## 3. Hydration Pipeline

- [x] 3.1 Implement GitHub fetcher for bodies/comments with pagination (`per_page=100`) and ETag reuse
- [x] 3.2 Add concurrency limiter (max 3 in-flight) and conservative session cap (200 requests)
- [x] 3.3 Aggregate commentsText and construct ThreadDoc payloads
- [x] 3.4 Wire hydration to browser adapter ingestion; surface partial status when capped
- [x] 3.5 Add manual cache clear for hydrated bodies/comments

## 4. SQLite Adapter (Optional)

- [ ] 4.1 Add local SQLite/FTS5 setup (schema + triggers for threads/threads_fts)
- [ ] 4.2 Implement `/search/index`, `/search/query`, `/search/status` local endpoints
- [ ] 4.3 Implement SQLite adapter client (indexThreads/search/status) with fallback on failure

## 5. UX and Feedback

- [ ] 5.1 Expose adapter selection toggle/config and display current adapter in status UI
- [ ] 5.2 Show hydration/partial status in search UI; allow retry after cap
- [ ] 5.3 Add snippets/highlights in search results

## 6. Testing

- [ ] 6.1 Unit tests for adapter contract (browser + mocked sqlite client)
- [ ] 6.2 Integration tests for hydration pipeline (mock GitHub responses, ETag path, cap path)
- [ ] 6.3 Search ranking/filter tests (title vs body, unread boost)
- [ ] 6.4 Fallback tests (SQLite down → browser)
