import React, { useEffect, useState } from 'react';
import { getNotifications, markNotificationAsRead, markRepoNotificationsAsRead } from '../api/github';
import styles from './NotificationList.module.css';
import useNotificationDetails from '../hooks/useNotificationDetails';
import NotificationItem from './NotificationItem'; // Import the new component

interface Notification {
  id: string;
  repository: {
    full_name: string;
  };
  subject: {
    title: string;
    url: string;
    type: string; // Add type here
  };
  details: {
    state: string;
  };
}


const NotificationList: React.FC<{ token: string, prioritizedRepos?: string[] }> = ({ token, prioritizedRepos = [] }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [doneNotifications, setDoneNotifications] = useState<Set<string>>(new Set());
  const [doneRepos, setDoneRepos] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const { getNotificationDetails } = useNotificationDetails(token);
  const [filter, setFilter] = useState<string | null>(null); // Add filter state

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications(token);
        if (data.status === 200) {
          const detailedNotifications = await Promise.all<Notification>(data.json.map(async (notification: Notification) => {
            const details = await getNotificationDetails(notification.subject.url);
            return { ...notification, details };
          }));
          setNotifications(detailedNotifications);
        } else {
          console.error(data);
          setError('Failed to fetch notifications');
        }
      } catch (err) {
        setError('Failed to fetch notifications');
        console.error(err);
      }
    };
    fetchNotifications().then(() => console.log("fetched"))
  }, []); // probably incorrect, but 

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

  const filteredNotifications = filter
    ? notifications.filter(notification => notification.subject.type === filter)
    : notifications;

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
      <div className={styles.filterButtons}>
        <button onClick={() => setFilter(null)}>All</button>
        <button onClick={() => setFilter('PullRequest')}>Pull Requests</button>
        <button onClick={() => setFilter('Issue')}>Issues</button>
      </div>
      {!error && sortedRepoNames.map((repoName) => (
        <div key={repoName} className={doneRepos.has(repoName) ? styles.done : ''}>
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
