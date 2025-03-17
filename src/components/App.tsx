"use client";

import React, { useEffect, useMemo, useReducer, useState } from "react";
import NotificationList from "./notifications/NotificationList";
import SettingsPane from "./settings/SettingsPane";
import useNotifications from "../hooks/useNotifications";
import styles from "./App.module.css";
import { AppContext, AppDispatchContext } from "@/store/AppContext";
import { initialState, makeReducer } from "@/store/AppReducer";
import { LocalStorageStore } from "@/store/AppStorage";
import { Filters } from "./filters/Filters";
import CommandPalette from "./CommandPalette";

export const App: React.FC = () => {
  const token = process.env.NEXT_GH_TOKEN || "";
  const store = useMemo(() => new LocalStorageStore(), []);
  const reducer = makeReducer(store);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { fetchNotifications } = useNotifications(token, dispatch);
  const [isPaletteVisible, setPaletteVisible] = useState<boolean>(false);

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

  return (
    <AppContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        <div className={styles.appContainer}>
          <SettingsPane />
          <Filters />
          <NotificationList />
          <CommandPalette
            isVisible={isPaletteVisible}
            onClose={handleClosePalette}
          />
        </div>
      </AppDispatchContext.Provider>
    </AppContext.Provider>
  );
};
