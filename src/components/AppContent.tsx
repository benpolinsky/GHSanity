'use client';

import React, { useEffect, useState } from "react";
import NotificationList from "./NotificationList";
import SettingsPane from "./SettingsPane";
import NotificationFilter, { ValidFilters } from "./NotificationFilter";
import AdditionalFilters from "./AdditionalFilters";
import { getNotifications } from "@/app/api/github";
import useNotificationDetails from "../hooks/useNotificationDetails";
import styles from "../App.module.css";
import { Notification } from '../types';

export const AppContent: React.FC = () => {
  // Use Next.js environment variable instead of Vite's
  const token = process.env.NEXT_GH_TOKEN || '';
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [labelFilters, setLabelFilters] = useState<string[]>([]);
  const [prioritizedRepos, setPrioritizedRepos] = useState<string[]>([
    "iTwin/itwinjs-core",
    "iTwin/coordinate-reference-system-service",
  ]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { getNotificationDetails } = useNotificationDetails(token);
  const [filter, setFilter] = useState<ValidFilters | null>(null);
  const [additionalFilter, setAdditionalFilter] = useState<string | null>(null);
  const [stateFilter, setStateFilter] = useState<string>("all");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const data = await getNotifications(token);
        if (data.status === 200) {
          console.log(`Fetched ${data.json.length} notifications in total`);
          const detailedNotifications = await Promise.all(
            data.json.map(async (notification: Notification) => {
              const details = await getNotificationDetails(
                notification.subject.url
              );
              return { ...notification, details };
            })
          );
          setNotifications(detailedNotifications);
        } else {
          console.error(data);
          setError("Failed to fetch notifications");
        }
      } catch (err) {
        setError("Failed to fetch notifications");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifications().then(() => console.log("fetched"));
  }, [token, getNotificationDetails]);

  const allLabels: string[] = []

  notifications.forEach((notification) => {
    notification.details.labels?.forEach(label => {
      if (!allLabels.includes(label.name)) {
        allLabels.push(label.name)
      }
    })
  })

  const allRepoNames = new Set(notifications.map((notification) => notification.repository.full_name))

  return (
    <div className={styles.appContainer}>
      <div className={styles.filtersContainer}>
        <NotificationFilter setFilter={setFilter} activeFilter={filter} />
        <AdditionalFilters
          setAdditionalFilter={setAdditionalFilter}
          activeAdditionalFilter={additionalFilter}
          notifications={notifications}
          onFilterChange={setStateFilter}
        />
        <SettingsPane
          allRepoNames={[...allRepoNames]}
          labelFilters={labelFilters}
          setLabelFilters={setLabelFilters}
          allLabels={allLabels}
          prioritizedRepos={prioritizedRepos}
          setPrioritizedRepos={setPrioritizedRepos}
        />
      </div>
      <NotificationList
        token={token}
        notifications={notifications}
        labelFilters={labelFilters}
        prioritizedRepos={prioritizedRepos}
        error={error}
        filter={filter}
        additionalFilter={additionalFilter}
        stateFilter={stateFilter}
        isLoading={isLoading}
      />
    </div>
  );
}; 