"use client";

import React, { useContext, useMemo } from "react";
import styles from "./ReasonPills.module.css";
import { AppContext, AppDispatchContext } from "@/store/AppContext";
import { NotificationReason, ReasonFilter } from "@/types";
import { isParticipating } from "@/shared/filterHelpers";

const PILLS: { label: string; value: ReasonFilter }[] = [
  { label: "Assigned", value: "assign" },
  { label: "Participating", value: "participating" },
  { label: "Mentioned", value: "mention" },
  { label: "Team", value: "team_mention" },
  { label: "Review", value: "review_requested" },
];

const ReasonPills: React.FC = () => {
  const { reasonFilter, notifications } = useContext(AppContext);
  const dispatch = useContext(AppDispatchContext);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const n of notifications) {
      const r: NotificationReason = n.reason;
      map[r] = (map[r] || 0) + 1;
      if (isParticipating(r)) {
        map["participating"] = (map["participating"] || 0) + 1;
      }
    }
    return map;
  }, [notifications]);

  const toggle = (value: ReasonFilter) => {
    dispatch({
      type: "SET_REASON_FILTER",
      payload: reasonFilter === value ? null : value,
    });
  };

  return (
    <div className={styles.pills} role="group" aria-label="Filter by reason">
      {PILLS.map(({ label, value }) => {
        const active = reasonFilter === value;
        const count = value ? (counts[value] ?? 0) : 0;
        return (
          <button
            key={value}
            aria-pressed={active}
            className={`${styles.pill} ${active ? styles.active : ""}`}
            onClick={() => toggle(value)}
          >
            {label}
            {count > 0 && <span className={styles.count}>{count}</span>}
          </button>
        );
      })}
    </div>
  );
};

export default ReasonPills;
