"use client";

import React from "react";
import styles from "./BulkActionBar.module.css";
import { markNotificationAsRead } from "@/app/api/github";

interface BulkActionBarProps {
  selectedNotifications: Set<string>;
  setSelectedNotifications: React.Dispatch<React.SetStateAction<Set<string>>>;
  onMarkSelectedAsRead?: (ids: string[]) => void;
}

const BulkActionBar: React.FC<BulkActionBarProps> = ({
  selectedNotifications,
  setSelectedNotifications,
  onMarkSelectedAsRead,
}) => {
  if (selectedNotifications.size === 0) return null;

  const markSelectedAsRead = async () => {
    const ids = Array.from(selectedNotifications);
    // Optimistically reflect completion in UI
    onMarkSelectedAsRead?.(ids);
    const promises = ids.map((id) => markNotificationAsRead(id));
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
