import React from 'react';
import styles from './NotificationList.module.css';
import IssueIcon from '../assets/issue.svg?react';
import PRIcon from '../assets/pr.svg?react';
import MarkAsDoneIcon from '../assets/check.svg?react';

interface Notification {
  id: string;
  subject: {
    title: string;
    url: string;
    type: string; // Add type here
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
  const Icon = notification.subject.type === 'PullRequest' ? PRIcon : IssueIcon
    // console.log(issueIcon)
  return (
    <li className={`${styles.notificationItem} ${doneNotifications.has(notification.id) ? styles.done : ''}`}>
      <span>
        <Icon className={styles.typeIcon}/>
        <a target="_blank" href={getWebsiteUrl(notification.subject.url)} className={styles.notificationLink}>{notification.subject.title}</a>
      </span>
      <span className={styles.statusBox}>
        <button className={styles.doneButton} onClick={() => markNotificationAsDone(notification.id)}>
          <MarkAsDoneIcon />
        </button>
        <p className={styles.notificationDetails}>{notification.details.state}</p>
      </span>
    </li>
  );
};

export default NotificationItem;
