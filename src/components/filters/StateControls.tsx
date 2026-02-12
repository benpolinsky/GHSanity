"use client";

import React, { useContext } from "react";
import styles from "./StateControls.module.css";
import { AppContext, AppDispatchContext } from "@/store/AppContext";

const STATE_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Open", value: "open" },
  { label: "Closed", value: "closed" },
] as const;

const StateControls: React.FC = () => {
  const { stateFilter, draftFilter } = useContext(AppContext);
  const dispatch = useContext(AppDispatchContext);

  return (
    <div className={styles.controls}>
      <div
        className={styles.stateSegments}
        role="radiogroup"
        aria-label="Filter by state"
      >
        {STATE_OPTIONS.map(({ label, value }) => {
          const active = stateFilter === value;
          return (
            <button
              key={value}
              role="radio"
              aria-checked={active}
              className={`${styles.stateSegment} ${active ? styles.active : ""}`}
              onClick={() =>
                dispatch({ type: "SET_STATE_FILTER", payload: value })
              }
            >
              {label}
            </button>
          );
        })}
      </div>

      <label className={styles.draftToggle}>
        <span className={styles.draftLabel}>Drafts</span>
        <button
          role="switch"
          aria-checked={draftFilter}
          className={`${styles.toggle} ${draftFilter ? styles.toggleOn : ""}`}
          onClick={() =>
            dispatch({ type: "TOGGLE_DRAFT_FILTER", payload: null })
          }
        >
          <span className={styles.toggleThumb} />
        </button>
      </label>
    </div>
  );
};

export default StateControls;
