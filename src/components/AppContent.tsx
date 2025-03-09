'use client';

import React, { useEffect, useMemo, useReducer } from "react";
import NotificationList from "./NotificationList";
import SettingsPane from "./SettingsPane";
import NotificationFilter from "./NotificationFilter";
import AdditionalFilters from "./AdditionalFilters";
import useNotifications from "../hooks/useNotifications";
import styles from "../App.module.css";
import { AppContext, AppDispatchContext } from "@/store/AppContext";
import { initialState, makeReducer } from "@/store/AppReducer";
import { LocalStorageStore } from "@/store/AppStorage";

export const AppContent: React.FC = () => {
  const token = process.env.NEXT_GH_TOKEN || '';
  const store = useMemo(() => new LocalStorageStore(), [])
  const reducer = makeReducer(store);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { fetchNotifications } = useNotifications(token, dispatch);

  useEffect(() => {
    fetchNotifications().then(() => console.log("fetched"));
  }, []);

  useEffect(() => {
    async function loadFromStore() {
      const savedState = store.load();
      if (savedState) {
        dispatch({ type: "SET_PRIORITIZED_REPOS", payload: savedState.prioritizedRepos });
        dispatch({ type: "SET_LABEL_FILTERS", payload: savedState.labelFilters });
      }
    }
    loadFromStore()
  }, [])

  return (
    <AppContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        <div className={styles.appContainer}>
          <div className={styles.filtersContainer}>
            <NotificationFilter />
            <AdditionalFilters />
            <SettingsPane />
          </div>
          <NotificationList />
        </div>
      </AppDispatchContext.Provider>
    </AppContext.Provider>
  );
};