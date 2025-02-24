import React, { useState } from 'react';
import { markNotificationAsRead, markRepoNotificationsAsRead } from '../api/github';
import styles from './NotificationList.module.css';
import NotificationItem from './NotificationItem';
import { Notification, NotificationListProps } from '../types'; // Import consolidated types

const NotificationList: React.FC<NotificationListProps> = ({ token, notifications, labelFilters, prioritizedRepos, error, filter, additionalFilter, stateFilter }) => {
  const [doneNotifications, setDoneNotifications] = useState<Set<string>>(new Set());
  const [doneRepos, setDoneRepos] = useState<Set<string>>(new Set());

  const getWebsiteUrl = (apiUrl: string) => {
    return apiUrl.replace('api.github.com/repos', 'github.com').replace('/pulls/', '/pull/');
  };

  const markNotificationAsDone = async (id: string) => {
    try {
      const response = await markNotificationAsRead(token, id);
      if (response.status === 205) {
        setDoneNotifications(new Set(doneNotifications).add(id));
      } else {
        console.error('Failed to mark notification as done', response);
      }
    } catch (err) {
      console.error('Failed to mark notification as done', err);
    }
  };

  const markRepoAsDone = async (repoName: string) => {
    try {
      const response = await markRepoNotificationsAsRead(token, repoName);
      if (response.status === 205) {
        setDoneRepos(new Set(doneRepos).add(repoName));
      } else {
        console.error('Failed to mark repo notifications as done', response);
      }
    } catch (err) {
      console.error('Failed to mark repo notifications as done', err);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesType = filter ? notification.subject.type === filter : true;
    const matchesAdditionalFilter = additionalFilter ? notification.reason === additionalFilter : true;
    const matchesState = stateFilter === 'all' ? true : (stateFilter === 'open' ? !notification.details.state.includes('closed') : notification.details.state.includes('closed'));
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

  return (
    <div className={styles.notificationList}>
      {error && <div className={styles.error}>{error}</div>}
      {!error && sortedRepoNames.map((repoName) => (
        <div key={repoName} className={doneRepos.has(repoName) ? `${styles.done} ${styles.repo}` : styles.repo}>
          <h2 className={styles.repoName}>
            {repoName}
            <button className={styles.doneButton} onClick={() => markRepoAsDone(repoName)}>
              Mark all as read
            </button>
          </h2>
          <ul className={styles.notificationItems}>
            {groupedNotifications[repoName].map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                doneNotifications={doneNotifications}
                markNotificationAsDone={markNotificationAsDone}
                getWebsiteUrl={getWebsiteUrl}
              />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
