"use client";

import React from "react";
import styles from "./Labels.module.css";
import { Label } from "../../types";

interface LabelsProps {
  labels?: Label[];
}

const MAX_VISIBLE = 2;

const Labels: React.FC<LabelsProps> = ({ labels }) => {
  if (!labels || labels.length === 0) return null;

  const visible = labels.slice(0, MAX_VISIBLE);
  const overflow = labels.length - MAX_VISIBLE;

  return (
    <div className={styles.labels}>
      {visible.map((label) => (
        <span
          key={label.id}
          className={styles.chip}
          style={{
            backgroundColor: `#${label.color}22`,
            color: `#${label.color}`,
            borderColor: `#${label.color}44`,
          }}
        >
          {label.name}
        </span>
      ))}
      {overflow > 0 && <span className={styles.overflow}>+{overflow}</span>}
    </div>
  );
};

export default Labels;
