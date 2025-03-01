import React, { useState } from 'react';
import { markNotificationAsRead } from '../api/github';
import styles from './NotificationList.module.css';
import NotificationItem from './NotificationItem';
import { Notification, NotificationListProps } from '../types'; // Import consolidated types

const NotificationList: React.FC<NotificationListProps> = ({ token, notifications, labelFilters, prioritizedRepos, error, filter, additionalFilter, stateFilter }) => {
  const [doneNotifications, setDoneNotifications] = useState<Set<string>>(new Set());
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());

  const getWebsiteUrl = (apiUrl: string) => {
    return apiUrl.replace('api.github.com/repos', 'github.com').replace('/pulls/', '/pull/');
  };

  const markNotificationAsDone = async (id: string) => {
    try {
      const response = await markNotificationAsRead(token, id);
      if (response.status === 205) {
        setDoneNotifications(prevDoneNotifications => new Set(prevDoneNotifications).add(id));
      } else {
        console.error('Failed to mark notification as done', response);
      }
    } catch (err) {
      console.error('Failed to mark notification as done', err);
    }
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
    const repoNotifications = groupedNotifications[repoName].map(notification => notification.id);
    const newSelectedNotifications = new Set(selectedNotifications);
    const allSelected = repoNotifications.every(id => newSelectedNotifications.has(id));

    if (allSelected) {
      repoNotifications.forEach(id => newSelectedNotifications.delete(id));
    } else {
      repoNotifications.forEach(id => newSelectedNotifications.add(id));
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
    const matchesType = filter ? notification.subject.type === filter : true;
    const matchesAdditionalFilter = additionalFilter ? notification.reason === additionalFilter : true;
    const matchesState = stateFilter === 'all' ? true : (stateFilter === 'open' ? !notification.details.state?.includes('closed') : notification.details.state?.includes('closed'));
    const labelExcludes = notification.details.labels?.some(label => labelFilters.includes(label.name));
    return matchesType && matchesAdditionalFilter && matchesState && !labelExcludes;
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
      {error && <div className={styles.error}>{error}</div>}
      {!error && (
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
                {groupedNotifications[repoName].every(notification => selectedNotifications.has(notification.id)) ? 'Deselect All' : 'Select All'}
              </button>
              <ul className={styles.notificationItems}>
                {groupedNotifications[repoName].map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    doneNotifications={doneNotifications}
                    markNotificationAsDone={markNotificationAsDone}
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
