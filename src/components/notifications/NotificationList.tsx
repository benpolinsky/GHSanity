'use client';

import React, { useState, useContext } from 'react';
import styles from './NotificationList.module.css';
import NotificationItem from './NotificationItem';
import { Label, Notification } from '../../types'; // Import consolidated types
import { markNotificationAsRead } from '@/app/api/github';
import { AppContext } from '@/store/AppContext';

const NotificationList: React.FC = () => {
  const { notifications, labelFilters, prioritizedRepos, error, filter, reasonFilter, stateFilter, isLoading } = useContext(AppContext);
  const [doneNotifications, setDoneNotifications] = useState<Set<string>>(new Set());
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());

  const getWebsiteUrl = (apiUrl: string) => {
    // Convert API URL to website URL
    const websiteUrl = apiUrl.replace('api.github.com/repos', 'github.com').replace('/pulls/', '/pull/');

    // For issues and PRs, append a fragment to scroll to the bottom where latest comments are
    if (apiUrl.includes('/issues/') || apiUrl.includes('/pulls/')) {
      return `${websiteUrl}#partial-timeline`;
    }

    return websiteUrl;
  };

  const markNotificationAsDone = async (id: string) => {
    try {
      const response = await markNotificationAsRead(id);
      if (response.status === 205) {
        setDoneNotifications(prevDoneNotifications => new Set(prevDoneNotifications).add(id));
      } else {
        console.error('Failed to mark notification as done', response);
      }
    } catch (err) {
      console.error('Failed to mark notification as done', err);
    }
  };

  // Mark notification as read internally without API call
  const markNotificationAsReadInternally = (id: string) => {
    setDoneNotifications(prevDoneNotifications => new Set(prevDoneNotifications).add(id));
  };

  const toggleNotificationSelection = (id: string) => {
    const newSelectedNotifications = new Set(selectedNotifications);
    if (newSelectedNotifications.has(id)) {
      newSelectedNotifications.delete(id);
    } else {
      newSelectedNotifications.add(id);
    }
    setSelectedNotifications(newSelectedNotifications);
  };

  const markSelectedAsDone = async () => {
    const newDoneNotifications = new Set(doneNotifications);
    const markAsDonePromises = Array.from(selectedNotifications).map(id => markNotificationAsDone(id));

    await Promise.all(markAsDonePromises);

    selectedNotifications.forEach(id => newDoneNotifications.add(id));
    setDoneNotifications(newDoneNotifications);
    setSelectedNotifications(new Set());
  };

  const selectAllNotifications = () => {
    const allNotificationIds = new Set(filteredNotifications.map(notification => notification.id));
    setSelectedNotifications(allNotificationIds);
  };

  const deselectAllNotifications = () => {
    setSelectedNotifications(new Set());
  };

  const toggleRepoSelection = (repoName: string) => {
    const repoNotifications = groupedNotifications[repoName].map((notification: Notification) => notification.id);
    const newSelectedNotifications = new Set(selectedNotifications);
    const allSelected = repoNotifications.every((id: string) => newSelectedNotifications.has(id));

    if (allSelected) {
      repoNotifications.forEach((id: string) => newSelectedNotifications.delete(id));
    } else {
      repoNotifications.forEach((id: string) => newSelectedNotifications.add(id));
    }

    setSelectedNotifications(newSelectedNotifications);
  };

  const toggleGlobalSelection = () => {
    if (selectedNotifications.size === filteredNotifications.length) {
      deselectAllNotifications();
    } else {
      selectAllNotifications();
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesType = filter ? notification.subject.type === filter : true; // pr/issue/etc
    const matchesReasonFilter = reasonFilter ? notification.reason === reasonFilter : true; // mentioned/assigned/participating (though infer that from commented or other)
    const matchesState = stateFilter === 'all' ? true : (stateFilter === 'open' ? !notification.details.state?.includes('closed') : notification.details.state?.includes('closed')); // open closed
    const labelExcludes = notification.details.labels?.some((label: Label) => labelFilters.includes(label.name)); // labels
    return matchesType && matchesReasonFilter && matchesState && !labelExcludes;
  });

  const groupedNotifications = filteredNotifications.reduce((acc, notification) => {
    const repoName = notification.repository.full_name;
    if (!acc[repoName]) {
      acc[repoName] = [];
    }
    acc[repoName].push(notification);
    return acc;
  }, {} as Record<string, Notification[]>);

  const sortedRepoNames = Object.keys(groupedNotifications).sort((a, b) => {
    const aPriority = prioritizedRepos.includes(a) ? 0 : 1;
    const bPriority = prioritizedRepos.includes(b) ? 0 : 1;
    return aPriority - bPriority;
  });

  // Calculate total number of notifications
  const totalNotificationsCount = filteredNotifications.length;

  return (
    <div className={styles.notificationList}>
      {error && <div className={styles.error}>{JSON.stringify(error)}</div>}
      {isLoading && (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading all notifications...</p>
        </div>
      )}
      {!error && !isLoading && (
        <>
          <div className={styles.globalActions}>
            <div className={styles.buttonGroup}>
              <button onClick={toggleGlobalSelection}>
                {selectedNotifications.size === filteredNotifications.length ? 'Deselect All' : 'Select All'}
              </button>
              <button onClick={markSelectedAsDone} disabled={selectedNotifications.size === 0}>
                Mark Selected as Read
              </button>
            </div>
            <div className={styles.notificationCount}>
              Total Notifications: <strong>{totalNotificationsCount}</strong>
            </div>
          </div>
          {sortedRepoNames.map((repoName) => (
            <div key={repoName} className={styles.repo}>
              <h2 className={styles.repoName}>
                <span className={styles.repoNameText}>{repoName}</span> <span className={styles.repoCount}>({groupedNotifications[repoName].length})</span>
              </h2>
              <button className={styles.selectButton} onClick={() => toggleRepoSelection(repoName)}>
                {groupedNotifications[repoName].every((notification: Notification) => selectedNotifications.has(notification.id)) ? 'Deselect All' : 'Select All'}
              </button>
              <ul className={styles.notificationItems}>
                {groupedNotifications[repoName].map((notification: Notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    doneNotifications={doneNotifications}
                    markNotificationAsDone={markNotificationAsDone}
                    markNotificationAsReadInternally={markNotificationAsReadInternally}
                    getWebsiteUrl={getWebsiteUrl}
                    toggleNotificationSelection={toggleNotificationSelection}
                    isSelected={selectedNotifications.has(notification.id)}
                  />
                ))}
              </ul>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default NotificationList;
