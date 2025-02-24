import React from 'react';
import styles from './NotificationList.module.css';
import IssueIcon from '../assets/issue.svg?react';
import PRIcon from '../assets/pr.svg?react';
import ReleaseIcon from '../assets/release.svg?react'; // Import Release icon
import MarkAsDoneIcon from '../assets/check.svg?react';
import Labels from './Labels';
import { NotificationItemProps } from '../types'; // Import consolidated types

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, doneNotifications, markNotificationAsDone, getWebsiteUrl, toggleNotificationSelection, isSelected }) => {
  let Icon;
  if (notification.subject.type === 'PullRequest') {
    Icon = PRIcon;
  } else if (notification.subject.type === 'Release') {
    Icon = ReleaseIcon;
  } else {
    Icon = IssueIcon;
  }

  return (
    <li className={`${styles.notificationItem} ${doneNotifications.has(notification.id) ? styles.done : ''}`} data-testid={`notification-item-${notification.id}`}>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => toggleNotificationSelection(notification.id)}
        data-testid={`checkbox-${notification.id}`}
      />
      <span className={styles.notificationMain}>
        <Icon className={`${styles.typeIcon} ${notification.details.state?.toLowerCase() === "open" ? styles.iconOpen : styles.iconClosed}`}/>
        <a target="_blank" href={getWebsiteUrl(notification.subject.url)} className={styles.notificationLink}>{notification.subject.title}</a>
        <Labels labels={notification.details.labels} />
      </span>
      <button className={styles.itemDoneButton} data-testid={`mark-as-done-${notification.id}`}>
        <MarkAsDoneIcon onClick={() => markNotificationAsDone(notification.id)} />
      </button>
    </li>
  );
};

export default NotificationItem;
