"use client";

import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import Fuse from "fuse.js";
import styles from "./CommandPalette.module.css";
import { AppContext, AppDispatchContext } from "@/store/AppContext";
import type { Notification } from "@/types";
import NotificationTypeIcon from "@/components/notifications/NotificationTypeIcon";

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
  | { kind: "command"; label: string; action: () => void };

const CommandPalette: React.FC<CommandPaletteProps> = ({
  isVisible,
  onClose,
}) => {
  const { notifications } = useContext(AppContext);
  const dispatch = useContext(AppDispatchContext);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ResultItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

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

    // Default: Fuse.js search
    const fuse = new Fuse(notifications, {
      keys: ["subject.title", "subject.type", "repository.full_name"],
      includeScore: true,
      threshold: 0.4,
    });
    const fuseResults = fuse.search(query, { limit: 15 });
    setResults(
      fuseResults.map((r) => ({
        kind: "notification" as const,
        notification: r.item,
      })),
    );
    setActiveIndex(fuseResults.length > 0 ? 0 : -1);
  }, [query, notifications, allRepoNames, dispatch, executeAndClose]);

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
      </div>
    </div>
  );
};

export default CommandPalette;
