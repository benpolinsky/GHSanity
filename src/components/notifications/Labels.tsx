"use client";

import React from "react";
import styles from "./NotificationList.module.css";
import { Label } from "../../types"; // Import consolidated types

interface LabelsProps {
  labels?: Label[];
}

const Labels: React.FC<LabelsProps> = ({ labels }) => {
  return (
    labels &&
    labels?.length > 0 && (
      <div className={styles.labels}>
        {labels.map((label) => {
          return (
            <span key={label.id} className={styles.label}>
              {label.name}
            </span>
          );
        })}
      </div>
    )
  );
};

export default Labels;
