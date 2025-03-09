'use client';

import React, { useEffect, useReducer } from "react";
import NotificationList from "./NotificationList";
import SettingsPane from "./SettingsPane";
import NotificationFilter from "./NotificationFilter";
import AdditionalFilters from "./AdditionalFilters";
import useNotifications from "../hooks/useNotifications";
import styles from "../App.module.css";
import { AppContext, AppDispatchContext } from "@/store/AppContext";
import { initialState, reducer } from "@/store/AppReducer";

export const AppContent: React.FC = () => {
  const token = process.env.NEXT_GH_TOKEN || '';
  const [state, dispatch] = useReducer(reducer, initialState);
  const { fetchNotifications } = useNotifications(token, dispatch);

  useEffect(() => {
    fetchNotifications().then(() => console.log("fetched"));
  }, [token, fetchNotifications]);

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