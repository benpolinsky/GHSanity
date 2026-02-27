"use client";

import React, { useState, useContext } from "react";
import styles from "./NotificationList.module.css";
import NotificationItem from "./NotificationItem";
import {
  Label,
  Notification,
  NotificationReason,
  ReasonFilter,
} from "../../types";
import { markNotificationAsRead } from "@/app/api/github";
import { AppContext } from "@/store/AppContext";
import { isParticipating } from "@/shared/filterHelpers";

const NotificationList: React.FC<{
  selectedNotifications: Set<string>;
  setSelectedNotifications: React.Dispatch<React.SetStateAction<Set<string>>>;
  doneNotifications: Set<string>;
  setDoneNotifications: React.Dispatch<React.SetStateAction<Set<string>>>;
}> = ({
  selectedNotifications,
  setSelectedNotifications,
  doneNotifications,
  setDoneNotifications,
}) => {
  const {
    notifications,
    labelFilters,
    prioritizedRepos,
    error,
    typeFilter,
    reasonFilter,
    stateFilter,
    draftFilter,
    isLoading,
  } = useContext(AppContext);

  const markNotificationAsDone = async (id: string) => {
    // Optimistically mark as done so UI always reflects completion, even if API fails.
    setDoneNotifications((prev) => new Set(prev).add(id));
    try {
      const response = await markNotificationAsRead(id);
      if (response.status !== 205) {
        console.error("Failed to mark notification as done", response);
      }
    } catch (err) {
      console.error("Failed to mark notification as done", err);
    }
  };

  const markNotificationAsReadInternally = (id: string) => {
    setDoneNotifications((prev) => new Set(prev).add(id));
  };

  const toggleNotificationSelection = (id: string) => {
    setSelectedNotifications((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleRepoSelection = (repoName: string) => {
    const repoIds = groupedNotifications[repoName].map((n) => n.id);
    setSelectedNotifications((prev) => {
      const next = new Set(prev);
      const allSelected = repoIds.every((id) => next.has(id));
      repoIds.forEach((id) => (allSelected ? next.delete(id) : next.add(id)));
      return next;
    });
  };

  const matchesReasonFilter = (
    reasonFilter: ReasonFilter,
    notificationReason: NotificationReason,
  ) => {
    return reasonFilter
      ? (reasonFilter === "participating" &&
          isParticipating(notificationReason)) ||
          notificationReason === reasonFilter
      : true;
  };

  const filteredNotifications = notifications.filter((notification) => {
    const matchesType = typeFilter
      ? notification.subject.type === typeFilter
      : true;
    const matchesState =
      stateFilter === "all"
        ? true
        : stateFilter === "open"
          ? !notification.details.state?.includes("closed")
          : notification.details.state?.includes("closed");
    const labelExcludes = notification.details.labels?.some((label: Label) =>
      labelFilters.includes(label.name),
    );
    const matchesDraft = draftFilter ? notification.details.draft : true;
    return (
      matchesType &&
      matchesReasonFilter(reasonFilter, notification.reason) &&
      matchesState &&
      matchesDraft &&
      !labelExcludes
    );
  });

  const groupedNotifications = filteredNotifications.reduce(
    (acc, notification) => {
      const repoName = notification.repository.full_name;
      if (!acc[repoName]) acc[repoName] = [];
      acc[repoName].push(notification);
      return acc;
    },
    {} as Record<string, Notification[]>,
  );

  const sortedRepoNames = Object.keys(groupedNotifications).sort((a, b) => {
    const aPriority = prioritizedRepos.indexOf(a);
    const bPriority = prioritizedRepos.indexOf(b);
    return (
      (aPriority === -1 ? Infinity : aPriority) -
      (bPriority === -1 ? Infinity : bPriority)
    );
  });

  const allFilteredIds = filteredNotifications.map((n) => n.id);
  const allSelected =
    allFilteredIds.length > 0 &&
    allFilteredIds.every((id) => selectedNotifications.has(id));
  const someSelected =
    !allSelected && allFilteredIds.some((id) => selectedNotifications.has(id));

  const toggleSelectAll = () => {
    setSelectedNotifications((prev) => {
      if (allSelected) return new Set();
      return new Set([...prev, ...allFilteredIds]);
    });
  };

  const globalCheckboxRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (globalCheckboxRef.current) {
      globalCheckboxRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  let rowIndex = 0;

  return (
    <div className={styles.notificationList}>
      {error && <div className={styles.error}>{JSON.stringify(error)}</div>}
      {isLoading && (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
          <p>Loading notifications…</p>
        </div>
      )}
      {!error && !isLoading && filteredNotifications.length > 0 && (
        <>
          <div className={styles.selectAllRow}>
            <input
              ref={globalCheckboxRef}
              type="checkbox"
              className={styles.checkbox}
              checked={allSelected}
              onChange={toggleSelectAll}
              aria-label="Select all notifications"
            />
            <span className={styles.selectAllLabel}>
              {allSelected
                ? "Deselect all"
                : `Select all ${allFilteredIds.length}`}
            </span>
          </div>
          {sortedRepoNames.map((repoName) => {
            const repoNotifications = groupedNotifications[repoName];
            const repoIds = repoNotifications.map((n) => n.id);
            const repoAllSelected = repoIds.every((id) =>
              selectedNotifications.has(id),
            );
            const repoSomeSelected =
              !repoAllSelected &&
              repoIds.some((id) => selectedNotifications.has(id));
            return (
              <div key={repoName} className={styles.repoGroup}>
                <div className={styles.repoHeader}>
                  <RepoCheckbox
                    checked={repoAllSelected}
                    indeterminate={repoSomeSelected}
                    onChange={() => toggleRepoSelection(repoName)}
                  />
                  <a
                    href={`https://github.com/${repoName}`}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.repoName}
                  >
                    {repoName}
                  </a>
                  <span className={styles.repoCount}>
                    {repoNotifications.length}
                  </span>
                </div>
                <ul className={styles.notificationItems}>
                  {repoNotifications.map((notification) => {
                    const idx = rowIndex++;
                    return (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        doneNotifications={doneNotifications}
                        markNotificationAsDone={markNotificationAsDone}
                        markNotificationAsReadInternally={
                          markNotificationAsReadInternally
                        }
                        toggleNotificationSelection={
                          toggleNotificationSelection
                        }
                        isSelected={selectedNotifications.has(notification.id)}
                        animationIndex={idx}
                      />
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default NotificationList;

const RepoCheckbox: React.FC<{
  checked: boolean;
  indeterminate: boolean;
  onChange: () => void;
}> = ({ checked, indeterminate, onChange }) => {
  const ref = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return (
    <input
      ref={ref}
      type="checkbox"
      className={styles.repoCheckbox}
      checked={checked}
      onChange={onChange}
      aria-label="Select all in repo"
    />
  );
};
