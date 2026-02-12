"use client";

import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import styles from "./CommandPalette.module.css";
import { AppContext, AppDispatchContext } from "@/store/AppContext";
import type { Notification } from "@/types";
import NotificationTypeIcon from "@/components/notifications/NotificationTypeIcon";
import { SearchIndexContext } from "@/store/SearchIndexContext";
import type { SearchResult } from "@/search/types";
import { hydrateDiscussions } from "@/search/hydrationPipeline";

interface CommandPaletteProps {
  isVisible: boolean;
  onClose: () => void;
}

const TYPE_COMMANDS: Record<string, string> = {
  pr: "PullRequest",
  pullrequest: "PullRequest",
  issue: "Issue",
  issues: "Issue",
  release: "Release",
  releases: "Release",
};

const REASON_COMMANDS: Record<string, string> = {
  assigned: "assign",
  assign: "assign",
  participating: "participating",
  mentioned: "mention",
  mention: "mention",
  team: "team_mention",
  review: "review_requested",
};

type ResultItem =
  | { kind: "notification"; notification: Notification }
  | { kind: "repo"; repoName: string }
  | { kind: "command"; label: string; action: () => void }
  | { kind: "search"; hit: SearchResult };

const CommandPalette: React.FC<CommandPaletteProps> = ({
  isVisible,
  onClose,
}) => {
  const { notifications, stateFilter, typeFilter, draftFilter } =
    useContext(AppContext);
  const dispatch = useContext(AppDispatchContext);
  const searchIndex = useContext(SearchIndexContext);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ResultItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [status, setStatus] = useState(() => ({
    isReady: false,
    isHydrating: false,
    partialHydration: false,
    docCount: 0,
  }));
  const [debugInfo, setDebugInfo] = useState({
    lastQuery: "",
    hitCount: 0,
  });
  const [respectFilters, setRespectFilters] = useState(true);
  const [rehydrating, setRehydrating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const token = process.env.NEXT_GH_TOKEN || "";

  const allRepoNames = useMemo(
    () => Array.from(new Set(notifications.map((n) => n.repository.full_name))),
    [notifications],
  );

  const executeAndClose = useCallback(
    (fn: () => void) => {
      fn();
      setQuery("");
      onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!isVisible) {
      setQuery("");
      setResults([]);
      setActiveIndex(-1);
      return;
    }
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [isVisible]);

  useEffect(() => {
    if (!searchIndex) return;
    setStatus(searchIndex.status());
  }, [searchIndex, isVisible]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setActiveIndex(-1);
      return;
    }

    // Command prefix: type:
    const typeMatch = query.match(/^type:(\S*)$/i);
    if (typeMatch) {
      const val = typeMatch[1].toLowerCase();
      if (val && TYPE_COMMANDS[val]) {
        const payload = TYPE_COMMANDS[val];
        setResults([
          {
            kind: "command",
            label: `Set type filter → ${val}`,
            action: () =>
              executeAndClose(() => dispatch({ type: "SET_FILTER", payload })),
          },
        ]);
      } else {
        const matches = Object.keys(TYPE_COMMANDS).filter((k) =>
          k.startsWith(val),
        );
        setResults(
          matches.map((k) => ({
            kind: "command" as const,
            label: `type:${k}`,
            action: () =>
              executeAndClose(() =>
                dispatch({ type: "SET_FILTER", payload: TYPE_COMMANDS[k] }),
              ),
          })),
        );
      }
      setActiveIndex(0);
      return;
    }

    // Command prefix: reason:
    const reasonMatch = query.match(/^reason:(\S*)$/i);
    if (reasonMatch) {
      const val = reasonMatch[1].toLowerCase();
      if (val && REASON_COMMANDS[val]) {
        const payload = REASON_COMMANDS[val];
        setResults([
          {
            kind: "command",
            label: `Set reason filter → ${val}`,
            action: () =>
              executeAndClose(() =>
                dispatch({ type: "SET_REASON_FILTER", payload }),
              ),
          },
        ]);
      } else {
        const matches = Object.keys(REASON_COMMANDS).filter((k) =>
          k.startsWith(val),
        );
        setResults(
          matches.map((k) => ({
            kind: "command" as const,
            label: `reason:${k}`,
            action: () =>
              executeAndClose(() =>
                dispatch({
                  type: "SET_REASON_FILTER",
                  payload: REASON_COMMANDS[k],
                }),
              ),
          })),
        );
      }
      setActiveIndex(0);
      return;
    }

    // Command prefix: repo:
    const repoMatch = query.match(/^repo:(.*)$/i);
    if (repoMatch) {
      const val = repoMatch[1].toLowerCase();
      const matches = allRepoNames.filter((r) => r.toLowerCase().includes(val));
      setResults(matches.map((r) => ({ kind: "repo" as const, repoName: r })));
      setActiveIndex(matches.length > 0 ? 0 : -1);
      return;
    }

    let cancelled = false;
    const runSearch = async () => {
      if (!searchIndex) return;
      const filters: any = {};
      if (respectFilters) {
        if (stateFilter && stateFilter !== "all") filters.state = stateFilter;
        if (typeFilter) filters.type = typeFilter;
        if (draftFilter) filters.draft = true;
      }
      const hits = await searchIndex.search(query, respectFilters ? filters : undefined);
      if (cancelled) return;
      setDebugInfo({ lastQuery: query, hitCount: hits.length });
      setResults(hits.map((hit) => ({ kind: "search" as const, hit })));
      setActiveIndex(hits.length > 0 ? 0 : -1);
    };
    runSearch();
    return () => {
      cancelled = true;
    };
  }, [
    query,
    notifications,
    allRepoNames,
    dispatch,
    executeAndClose,
    searchIndex,
    stateFilter,
    typeFilter,
    draftFilter,
    respectFilters,
  ]);

  const highlightSnippet = (snippet: string, term: string) => {
    if (!term) return snippet;
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "ig");
    return snippet.split(regex).map((part, idx) =>
      regex.test(part) ? (
        <mark key={`${part}-${idx}`} className={styles.highlight}>
          {part}
        </mark>
      ) : (
        <span key={`${part}-${idx}`}>{part}</span>
      ),
    );
  };

  const selectResult = (item: ResultItem) => {
    if (item.kind === "command") {
      item.action();
    } else if (item.kind === "repo") {
      const el = document.querySelector(
        `a[href="https://github.com/${item.repoName}"]`,
      );
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setQuery("");
      onClose();
    } else if (item.kind === "search") {
      window.open(item.hit.url, "_blank");
      setQuery("");
      onClose();
    } else {
      window.open(item.notification.details.html_url, "_blank");
      setQuery("");
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0 && results[activeIndex]) {
      e.preventDefault();
      selectResult(results[activeIndex]);
    } else if (e.key === "Escape") {
      setQuery("");
      onClose();
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const child = listRef.current.children[activeIndex] as HTMLElement;
      child?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  if (!isVisible) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.palette} onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search notifications or type a command…"
          className={styles.input}
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-expanded={results.length > 0}
          aria-controls="palette-results"
          aria-activedescendant={
            activeIndex >= 0 ? `palette-item-${activeIndex}` : undefined
          }
        />
        {results.length > 0 && (
          <ul
            ref={listRef}
            id="palette-results"
            className={styles.resultsList}
            role="listbox"
          >
            {results.map((item, i) => (
              <li
                key={i}
                id={`palette-item-${i}`}
                role="option"
                aria-selected={i === activeIndex}
                className={`${styles.resultItem} ${i === activeIndex ? styles.resultActive : ""}`}
                onMouseDown={() => selectResult(item)}
                onMouseEnter={() => setActiveIndex(i)}
              >
                {item.kind === "notification" && (
                  <a
                    href={item.notification.details.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.resultLink}
                    onClick={(e) => e.preventDefault()}
                  >
                    <NotificationTypeIcon
                      notificationType={item.notification.subject.type}
                      state={item.notification.details.state}
                      isDraft={item.notification.details.draft}
                    />
                    <span className={styles.resultTitle}>
                      {item.notification.subject.title}
                    </span>
                    <span className={styles.resultRepo}>
                      {item.notification.repository.full_name}
                    </span>
                  </a>
                )}
                {item.kind === "search" && (
                  <a
                    href={item.hit.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.resultLink}
                    onClick={(e) => e.preventDefault()}
                  >
                    <NotificationTypeIcon
                      notificationType={item.hit.type}
                      state={item.hit.state || "open"}
                      isDraft={false}
                    />
                    <span className={styles.resultTitle}>{item.hit.title}</span>
                    <span className={styles.resultRepo}>{item.hit.repo}</span>
                    {item.hit.snippet && (
                      <span className={styles.resultSnippet}>
                        {highlightSnippet(item.hit.snippet, query)}
                      </span>
                    )}
                  </a>
                )}
                {item.kind === "repo" && (
                  <span className={styles.resultLink}>
                    <span className={styles.resultPrefix}>repo:</span>
                    <span className={styles.resultRepo}>{item.repoName}</span>
                  </span>
                )}
                {item.kind === "command" && (
                  <span className={styles.resultLink}>
                    <span className={styles.resultPrefix}>⌘</span>
                    <span className={styles.resultTitle}>{item.label}</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
        {!query && (
          <div className={styles.hint}>
            Try: <code>type:pr</code> <code>reason:assigned</code>{" "}
            <code>repo:org/name</code>
          </div>
        )}
        <div className={styles.statusBar}>
          <div className={styles.statusMeta}>
            <span>
              {status.docCount ?? 0} docs · {status.isReady ? "ready" : "loading"}
              {status.isHydrating ? " · hydrating" : ""}
              {status.partialHydration ? " · partial" : ""}
            </span>
            <span className={styles.statusDebug}>
              filters {respectFilters ? "on" : "off"}
            </span>
            {debugInfo.lastQuery && (
              <span className={styles.statusDebug}>
                last "{debugInfo.lastQuery}" → {debugInfo.hitCount} hits
              </span>
            )}
          </div>
          <div className={styles.statusActions}>
            <button
              className={styles.statusButton}
              onClick={() => setRespectFilters((v) => !v)}
            >
              {respectFilters ? "Respect filters" : "Ignore filters"}
            </button>
            <button
              className={styles.statusButton}
              onClick={() => searchIndex && setStatus(searchIndex.status())}
              disabled={!searchIndex}
            >
              Refresh
            </button>
            <button
              className={styles.statusButton}
              onClick={async () => {
                if (!searchIndex || !token || !notifications.length) return;
                setRehydrating(true);
                try {
                  await hydrateDiscussions(notifications, token, searchIndex);
                  setStatus(searchIndex.status());
                } finally {
                  setRehydrating(false);
                }
              }}
              disabled={!searchIndex || !token || !notifications.length || rehydrating}
            >
              {rehydrating ? "Rehydrating…" : "Retry hydration"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
