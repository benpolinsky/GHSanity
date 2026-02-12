"use client";

import React, { useContext, useMemo } from "react";
import styles from "./TypeSegments.module.css";
import { AppContext, AppDispatchContext } from "@/store/AppContext";
import { NotificationType } from "@/types";

const SEGMENTS: { label: string; value: NotificationType | null }[] = [
  { label: "All", value: null },
  { label: "PRs", value: "PullRequest" },
  { label: "Issues", value: "Issue" },
  { label: "Releases", value: "Release" },
];

const TypeSegments: React.FC = () => {
  const { typeFilter, notifications } = useContext(AppContext);
  const dispatch = useContext(AppDispatchContext);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: notifications.length };
    for (const n of notifications) {
      const t = n.subject.type;
      map[t] = (map[t] || 0) + 1;
    }
    return map;
  }, [notifications]);

  return (
    <div
      className={styles.segments}
      role="radiogroup"
      aria-label="Filter by type"
    >
      {SEGMENTS.map(({ label, value }) => {
        const active = typeFilter === value;
        const count = value ? (counts[value] ?? 0) : counts.all;
        return (
          <button
            key={label}
            role="radio"
            aria-checked={active}
            className={`${styles.segment} ${active ? styles.active : ""}`}
            onClick={() => dispatch({ type: "SET_FILTER", payload: value })}
          >
            {label}
            <span className={styles.badge}>{count}</span>
          </button>
        );
      })}
    </div>
  );
};

export default TypeSegments;
