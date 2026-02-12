"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import LabelFilter from "./LabelFilter";
import RepoPrioritization from "./RepoPrioritization";
import styles from "./SettingsPane.module.css";
import { CloseIcon } from "../icons";
import RateLimit from "../RateLimit";
import { SearchIndexContext } from "@/store/SearchIndexContext";
import { useContext } from "react";
import { clearHydrationCache } from "@/search/hydrationPipeline";

interface SettingsPaneProps {
  isVisible: boolean;
  onClose: () => void;
}

const SettingsPane: React.FC<SettingsPaneProps> = ({ isVisible, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const [clearing, setClearing] = useState(false);
  const searchIndex = useContext(SearchIndexContext);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isVisible) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible, onClose]);

  if (!isVisible || !mounted) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.panel}
        data-testid="settings-pane"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>Settings</span>
          <button
            className={styles.closeButton}
            onClick={onClose}
            data-testid="close-icon"
            aria-label="Close settings"
          >
            <CloseIcon className={styles.closeIcon} />
          </button>
        </div>

        <div className={styles.panelBody}>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Label Exclusions</h3>
            <LabelFilter />
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Repo Prioritization</h3>
            <RepoPrioritization />
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>API Rate Limit</h3>
            <RateLimit />
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Search Cache</h3>
            <button
              className={styles.actionButton}
              onClick={async () => {
                if (!searchIndex) return;
                setClearing(true);
                try {
                  await clearHydrationCache(searchIndex);
                } finally {
                  setClearing(false);
                }
              }}
              disabled={clearing || !searchIndex}
            >
              {clearing ? "Clearing…" : "Clear indexed bodies & comments"}
            </button>
          </section>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default SettingsPane;
