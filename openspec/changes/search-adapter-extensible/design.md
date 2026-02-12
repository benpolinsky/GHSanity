## Context
- Current search is in-memory Fuse over loaded notifications (title/type/repo). No bodies/comments; no persistence; no swap to heavier index.
- Need full-text over notification threads (title, body, comments) with a pluggable backend: browser FTS now; optional local SQLite FTS later. Must be rate-limit-aware fetching GH data.
- UI surfaces (command palette, future search panels) should talk to a single search interface; data hydration should be shared regardless of adapter.

## Goals / Non-Goals

**Goals:**
- Define a `SearchIndex` contract decoupling UI from implementation (browser vs SQLite).
- Implement browser adapter: IndexedDB persistence + in-memory FTS (MiniSearch/Lunr) over threads including bodies/comments.
- Implement shared hydration pipeline for bodies and comments (issue comments, PR review comments) with pagination, ETag, and concurrency caps.
- Allow optional swap to a local SQLite FTS adapter with the same document contract and API surface.
- Support ranking knobs (title > labels/repo > body > comments, unread/recency/prioritized-repo boosts) and filters (type/reason/state/draft/repo/label).

**Non-Goals:**
- Cloud/server deployment; all remains local/dev.
- New GitHub data beyond bodies/comments of issues/PRs already in notifications.
- Real-time keystroke-grade latency; acceptable to fetch/warm asynchronously.

## Decisions
- **Interface-first:** Introduce `SearchIndex` with `indexThreads(docs)`, `search(query, filters, opts)`, `status()`. Rationale: keeps UI stable while swapping backends; simplifies tests.
- **Document contract:** `ThreadDoc` includes id (thread), repo, type, title, body, commentsText (aggregated), labels, state, draft, reason, updatedAt, unread, url, plus optional ranking hints (repoPriority, unreadScore, recencyScore). Same shape for all adapters.
- **Fetch pipeline shared:** One hydrator fetches bodies/comments with ETag reuse, pagination (`per_page=100`), and concurrency cap (2–3). Produces `ThreadDoc` payloads for any adapter. Rationale: single place for rate-limit handling.
- **Browser adapter:** IndexedDB for persistence (docs + meta/etags) and MiniSearch/Lunr in-memory index built at startup; incremental updates after batches. Rationale: no extra process, offline-friendly.
- **SQLite adapter (optional):** Local API (Next route or small node/express) with SQLite FTS5. Schema: `threads` table + `threads_fts` virtual table; triggers keep FTS in sync. API: `/search/index` (bulk upsert), `/search/query`, `/search/status`. Rationale: stronger relevance/snippets, scalable to larger histories.
- **Ranking:** Weight title highest, then labels/repo, then body, then comments; boost unread and prioritized repos; recency decay. Apply consistently in both adapters (browser via MiniSearch term boosts + post-score adjust; SQLite via FTS rank + custom multipliers).
- **Filters:** Apply pre-filter on adapter query where supported; otherwise post-filter results. Keep existing command syntax (`type:`, `reason:`, `repo:`) and allow plain text.
- **Snippets:** Browser: compute from matched field locally. SQLite: use `fts5` snippet() for body/comments.
- **Adapter selection:** Config flag/env (e.g., `SEARCH_ADAPTER=browser|sqlite`) with a simple factory. Default to browser.

## Risks / Trade-offs
- [API cost] Fetching comments/reviews can raise GitHub rate usage → Mitigation: ETag/If-None-Match, pagination with caps, concurrency limit, optional "include discussions" toggle to defer comment fetch.
- [Warm-up latency] First-time comment fetch slows initial searches → Mitigation: stage fetch (titles first, bodies next, comments last), show status/progress, allow partial search while warming.
- [IndexedDB size/perf] Large comment sets may bloat storage → Mitigation: cap stored history (recent N threads), compress comment text (optional), prune closed/stale threads beyond window.
- [Adapter divergence] Browser vs SQLite feature drift → Mitigation: shared contract/tests; keep ranking/filter logic co-located; add adapter conformance tests.
- [Local service complexity] SQLite path adds a local server to run → Mitigation: keep optional; provide simple start script and fallback to browser.

## Migration Plan
1) Add `SearchIndex` interface + adapter factory; no behavior change yet.
2) Build browser adapter with IndexedDB + MiniSearch; wire command palette to use `SearchIndex` with existing fields.
3) Implement hydration pipeline for bodies/comments with ETag + batching; feed browser adapter; add staged warm-up and status reporting.
4) Add ranking/filter weighting; update search consumers to display snippets/matches.
5) (Optional) Implement SQLite FTS service and adapter; add config toggle; reuse hydration pipeline to feed SQLite.
6) Testing: unit tests for adapter contract; integration for fetch pipeline (mock GH); smoke search UX.

## Open Questions
- How large a history/window do we store locally (by time or count)?
- Do we gate comment fetching behind a UI toggle or always hydrate eagerly?
- What exact concurrency and batch limits for GH API (per-session cap)?
- Any need for saved queries or repo-scoped search UI beyond palette?
