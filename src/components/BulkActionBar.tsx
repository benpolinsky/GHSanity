"use client";

import React from "react";
import styles from "./BulkActionBar.module.css";
import { markNotificationAsRead } from "@/app/api/github";

interface BulkActionBarProps {
  selectedNotifications: Set<string>;
  setSelectedNotifications: React.Dispatch<React.SetStateAction<Set<string>>>;
}

const BulkActionBar: React.FC<BulkActionBarProps> = ({
  selectedNotifications,
  setSelectedNotifications,
}) => {
  if (selectedNotifications.size === 0) return null;

  const markSelectedAsRead = async () => {
    const promises = Array.from(selectedNotifications).map((id) =>
      markNotificationAsRead(id),
    );
    await Promise.all(promises);
    setSelectedNotifications(new Set());
  };

  const clearSelection = () => {
    setSelectedNotifications(new Set());
  };

  return (
    <div className={styles.bar}>
      <span className={styles.count}>
        {selectedNotifications.size} selected
      </span>
      <div className={styles.actions}>
        <button className={styles.actionButton} onClick={markSelectedAsRead}>
          Mark as read
        </button>
        <button className={styles.clearButton} onClick={clearSelection}>
          Clear
        </button>
      </div>
    </div>
  );
};

export default BulkActionBar;
