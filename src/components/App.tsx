"use client";

import React, { useEffect, useMemo, useReducer, useState } from "react";
import NotificationList from "./notifications/NotificationList";
import SettingsPane from "./settings/SettingsPane";
import useNotifications from "../hooks/useNotifications";
import styles from "./App.module.css";
import { AppContext, AppDispatchContext } from "@/store/AppContext";
import { initialState, makeReducer } from "@/store/AppReducer";
import { LocalStorageStore } from "@/store/AppStorage";
import FilterBar from "./filters/FilterBar";
import CommandPalette from "./CommandPalette";
import Toolbar from "./Toolbar";
import BulkActionBar from "./BulkActionBar";
import { createSearchIndex } from "@/search/adapterFactory";
import { SearchIndexContext } from "@/store/SearchIndexContext";
import { hydrateDiscussions } from "@/search/hydrationPipeline";
import type { ThreadDoc } from "@/search/types";

export const App: React.FC = () => {
  const token = process.env.NEXT_GH_TOKEN || "";
  const store = useMemo(() => new LocalStorageStore(), []);
  const reducer = makeReducer(store);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { fetchNotifications } = useNotifications(token, dispatch);
  const searchIndex = useMemo(() => createSearchIndex(), []);
  const [isPaletteVisible, setPaletteVisible] = useState<boolean>(false);
  const [isSettingsVisible, setSettingsVisible] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<
    Set<string>
  >(new Set());
  const [doneNotifications, setDoneNotifications] = useState<Set<string>>(new Set());

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.metaKey && event.key === "k") {
      event.preventDefault();
      setPaletteVisible(true);
    } else if (event.key === "Escape") {
      setPaletteVisible(false);
    }
  };

  const handleClosePalette = () => {
    setPaletteVisible(false);
  };

  useEffect(() => {
    fetchNotifications();

    async function loadSettingsFromStore() {
      const savedState = store.load();
      if (savedState) {
        dispatch({
          type: "SET_PRIORITIZED_REPOS",
          payload: savedState.prioritizedRepos,
        });
        dispatch({
          type: "SET_LABEL_FILTERS",
          payload: savedState.labelFilters,
        });
      }
    }
    loadSettingsFromStore();
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const buildDocs = (notifications: typeof state.notifications): ThreadDoc[] =>
      notifications.map((n) => ({
        id: n.id,
        repo: n.repository.full_name,
        type: n.subject.type,
        title: n.subject.title,
        body: n.details.body,
        labels: n.details.labels?.map((l) => l.name),
        state: n.details.state,
        draft: n.details.draft,
        reason: n.reason,
        updatedAt: (n as any).updated_at,
        unread: true,
        url: n.details.html_url,
      }));

    if (!state.notifications.length) return;
    const docs = buildDocs(state.notifications);
    searchIndex.indexThreads(docs);
    hydrateDiscussions(state.notifications, token, searchIndex);
  }, [state.notifications, token, searchIndex]);

  return (
    <AppContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        <SearchIndexContext.Provider value={searchIndex}>
          <div className={styles.appContainer}>
            <Toolbar
              filterBar={<FilterBar />}
              totalCount={state.notifications.length}
              selectedCount={selectedNotifications.size}
              onSettingsClick={() => setSettingsVisible(true)}
            />
            <main className={styles.mainContent}>
              <BulkActionBar
                selectedNotifications={selectedNotifications}
                setSelectedNotifications={setSelectedNotifications}
                onMarkSelectedAsRead={(ids) =>
                  setDoneNotifications((prev) => {
                    const next = new Set(prev);
                    ids.forEach((id) => next.add(id));
                    return next;
                  })
                }
              />
              <NotificationList
                selectedNotifications={selectedNotifications}
                setSelectedNotifications={setSelectedNotifications}
                doneNotifications={doneNotifications}
                setDoneNotifications={setDoneNotifications}
              />
            </main>
            <SettingsPane
              isVisible={isSettingsVisible}
              onClose={() => setSettingsVisible(false)}
            />
            <CommandPalette isVisible={isPaletteVisible} onClose={handleClosePalette} />
          </div>
        </SearchIndexContext.Provider>
      </AppDispatchContext.Provider>
    </AppContext.Provider>
  );
};
