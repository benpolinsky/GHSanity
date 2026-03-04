"use client";

import React, { useState, useEffect, useContext, useCallback } from "react";
import { createPortal } from "react-dom";
import LabelFilter from "./LabelFilter";
import RepoPrioritization from "./RepoPrioritization";
import styles from "./SettingsPane.module.css";
import { CloseIcon } from "../icons";
import RateLimit from "../RateLimit";
import { SearchIndexContext } from "@/store/SearchIndexContext";
import { clearHydrationCache } from "@/search/hydrationPipeline";
import { hydrateDiscussions } from "@/search/hydrationPipeline";
import { AppContext } from "@/store/AppContext";

interface SettingsPaneProps {
  isVisible: boolean;
  onClose: () => void;
}

const SettingsPane: React.FC<SettingsPaneProps> = ({ isVisible, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [rehydrating, setRehydrating] = useState(false);
  const [status, setStatus] = useState(() => ({
    isReady: false,
    isHydrating: false,
    partialHydration: false,
    docCount: 0,
  }));
  const searchIndex = useContext(SearchIndexContext);
  const { notifications } = useContext(AppContext);
  const token = process.env.NEXT_GH_TOKEN || "";

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (searchIndex) {
      const s = searchIndex.status();
      setStatus({
        isReady: s.isReady,
        isHydrating: s.isHydrating,
        partialHydration: s.partialHydration ?? false,
        docCount: s.docCount ?? 0,
      });
    }
  }, [searchIndex, isVisible]);

  const refreshStatus = useCallback(() => {
    if (!searchIndex) return;
    const s = searchIndex.status();
    setStatus({
      isReady: s.isReady,
      isHydrating: s.isHydrating,
      partialHydration: s.partialHydration ?? false,
      docCount: s.docCount ?? 0,
    });
  }, [searchIndex]);

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
            <h3 className={styles.sectionTitle}>Search Status</h3>
            <div className={styles.statusRow}>
              <span className={styles.statusLabel}>Adapter</span>
              <span className={styles.statusValue}>
                {(process.env.NEXT_PUBLIC_SEARCH_ADAPTER || "browser").toLowerCase()}
              </span>
            </div>
            <div className={styles.statusRow}>
              <span className={styles.statusLabel}>Index</span>
              <span className={styles.statusValue}>
                {status.docCount ?? 0} docs · {status.isReady ? "ready" : "loading"}
                {status.isHydrating ? " · hydrating" : ""}
                {status.partialHydration ? " · partial" : ""}
              </span>
            </div>
            <div className={styles.statusActions}>
              <button
                className={styles.actionButton}
                onClick={refreshStatus}
              >
                Refresh status
              </button>
              <button
                className={styles.actionButton}
                onClick={async () => {
                  if (!searchIndex || !token) return;
                  setRehydrating(true);
                  try {
                    await hydrateDiscussions(notifications, token, searchIndex);
                    refreshStatus();
                  } finally {
                    setRehydrating(false);
                  }
                }}
                disabled={rehydrating || !searchIndex || !token || !notifications.length}
              >
                {rehydrating ? "Rehydrating…" : "Retry hydration"}
              </button>
            </div>
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
