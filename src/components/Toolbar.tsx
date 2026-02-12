"use client";

import React from "react";
import styles from "./Toolbar.module.css";
import { GearIcon } from "./icons";

interface ToolbarProps {
  filterBar: React.ReactNode;
  totalCount: number;
  selectedCount: number;
  onSettingsClick: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  filterBar,
  totalCount,
  selectedCount,
  onSettingsClick,
}) => {
  return (
    <header className={styles.toolbar}>
      <div className={styles.left}>
        <span className={styles.appName}>GH Sanity</span>
      </div>
      <div className={styles.center}>{filterBar}</div>
      <div className={styles.right}>
        {selectedCount > 0 && (
          <span className={styles.selectedCount}>{selectedCount} selected</span>
        )}
        <span className={styles.totalCount}>
          {totalCount} <span className={styles.countLabel}>notifications</span>
        </span>
        <button
          className={styles.settingsButton}
          onClick={onSettingsClick}
          aria-label="Settings"
        >
          <GearIcon className={styles.gearIcon} />
        </button>
      </div>
    </header>
  );
};

export default Toolbar;
