import React from 'react';
import styles from './NotificationList.module.css';

interface Notification {
  id: string;
  subject: {
    title: string;
    url: string;
  };
  details: {
    state: string;
  };
}

interface NotificationItemProps {
  notification: Notification;
  doneNotifications: Set<string>;
  markNotificationAsDone: (id: string) => void;
  getWebsiteUrl: (apiUrl: string) => string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, doneNotifications, markNotificationAsDone, getWebsiteUrl }) => {
  return (
    <li className={`${styles.notificationItem} ${doneNotifications.has(notification.id) ? styles.done : ''}`}>
      <a target="_blank" href={getWebsiteUrl(notification.subject.url)} className={styles.notificationLink}>{notification.subject.title}</a>
      <span className={styles.statusBox}>
        <button className={styles.doneButton} onClick={() => markNotificationAsDone(notification.id)}>
          D
        </button>
        <p className={styles.notificationDetails}>{notification.details.state}</p>
      </span>
    </li>
  );
};

export default NotificationItem;
