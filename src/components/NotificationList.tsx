import React, { useEffect, useState } from 'react';
import { getNotifications, markNotificationAsRead, markRepoNotificationsAsRead } from '../api/github';
import styles from './NotificationList.module.css';

interface Notification {
  id: string;
  repository: {
    full_name: string;
  };
  subject: {
    title: string;
    url: string;
  };
}

const NotificationList: React.FC<{ token: string }> = ({ token }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [doneNotifications, setDoneNotifications] = useState<Set<string>>(new Set());
  const [doneRepos, setDoneRepos] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications(token);
        if (data.status === 200) {
          setNotifications(data.json);
        } else {
          console.error(data);
          setError('Failed to fetch notifications');
        }
      } catch (err) {
        setError('Failed to fetch notifications');
        console.error(err);
      }
    };
    fetchNotifications();
  }, [token]);

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

  const groupedNotifications = notifications.reduce((acc, notification) => {
    const repoName = notification.repository.full_name;
    if (!acc[repoName]) {
      acc[repoName] = [];
    }
    acc[repoName].push(notification);
    return acc;
  }, {} as Record<string, Notification[]>);

  return (
    <div className={styles.notificationList}>
      {error && <div className={styles.error}>{error}</div>}
      {!error && Object.keys(groupedNotifications).map((repoName) => (
        <div key={repoName} className={`${styles.repoSection} ${doneRepos.has(repoName) ? styles.done : ''}`}>
          <h2>
            {repoName}
            <button className={styles.doneButton} onClick={() => markRepoAsDone(repoName)}>Mark All as Read</button>
          </h2>
          <ul>
            {groupedNotifications[repoName].map((notification) => (
              <li key={notification.id} className={doneNotifications.has(notification.id) ? styles.done : ''}>
                <a target="_blank" href={getWebsiteUrl(notification.subject.url)}>{notification.subject.title}</a>
                <button className={styles.doneButton} onClick={() => markNotificationAsDone(notification.id)}>Mark as Read</button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
