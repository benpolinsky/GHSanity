"use client";

import React, { useContext } from "react";
import styles from "./ReasonFilters.module.css";
import { AppContext, AppDispatchContext } from "@/store/AppContext";
import { NotificationReason, ReasonFilter } from "@/types";
import { isParticipating } from "@/shared/filterHelpers";

const SelectFilter: React.FC<{
  filter: ReasonFilter | null;
  label: string;
  count: number;
}> = ({ filter, label, count }) => {
  const { reasonFilter } = useContext(AppContext);
  const dispatch = useContext(AppDispatchContext);

  const handleFilterChange = (filter: string | null) => {
    dispatch({ type: "SET_REASON_FILTER", payload: filter });
  };

  return (
    <a
      href="#"
      className={reasonFilter === filter ? styles.active : ""}
      onClick={() => handleFilterChange(filter)}
    >
      {label} {count ? `(${count})` : ""}
    </a>
  );
};

const ReasonFilters = () => {
  const { notifications } = useContext(AppContext);

  const filterCounts = notifications.reduce(
    (acc, notification) => {
      const reason = notification.reason;
      acc[reason] = (acc[reason] || 0) + 1;

      const _isParticipating = isParticipating(reason);
      if (_isParticipating) {
        acc["participating"] = (acc["participating"] || 0) + 1;
      }

      return acc;
    },
    {} as Record<NotificationReason | "participating", number>,
  );

  return (
    <div className={styles.filterLinks}>
      <SelectFilter filter={null} label="All" count={notifications.length} />
      <SelectFilter
        filter="assign"
        label="Assigned"
        count={filterCounts["assign"] || 0}
      />
      <SelectFilter
        filter="participating"
        label="Participating"
        count={filterCounts["participating"] || 0}
      />
      <SelectFilter
        filter="mention"
        label="Mentioned"
        count={filterCounts["mention"] || 0}
      />
      <SelectFilter
        filter="team_mention"
        label="Team Mentioned"
        count={filterCounts["team_mention"] || 0}
      />
      <SelectFilter
        filter="review_requested"
        label="Review Requested"
        count={filterCounts["review_requested"] || 0}
      />
    </div>
  );
};

export default ReasonFilters;
