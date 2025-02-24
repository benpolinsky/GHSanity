import React from 'react';
import styles from './NotificationList.module.css';
import IssueIcon from '../assets/issue.svg?react';
import PRIcon from '../assets/pr.svg?react';
import MarkAsDoneIcon from '../assets/check.svg?react';
import Labels from './Labels';
import { NotificationItemProps } from '../types'; // Import consolidated types

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, doneNotifications, markNotificationAsDone, getWebsiteUrl }) => {
  const Icon = notification.subject.type === 'PullRequest' ? PRIcon : IssueIcon;

  return (
    <li className={`${styles.notificationItem} ${doneNotifications.has(notification.id) ? styles.done : ''}`}>
      <span className={styles.notificationMain}>
        <Icon className={`${styles.typeIcon} ${notification.details.state?.toLowerCase() === "open" ? styles.iconOpen : styles.iconClosed}`}/>
        <a target="_blank" href={getWebsiteUrl(notification.subject.url)} className={styles.notificationLink}>{notification.subject.title}</a>
        <Labels labels={notification.details.labels} />
      </span>
        <button className={styles.itemDoneButton}>
          <MarkAsDoneIcon  onClick={() => markNotificationAsDone(notification.id)} />
        </button>      
    </li>
  );
};

export default NotificationItem;
