"use client";

import React from "react";
import styles from "./NotificationList.module.css";
import { CheckIcon } from "../icons";
import Labels from "./Labels";
import { NotificationItemProps } from "../../types"; // Import consolidated types
import NotificationTypeIcon from "./NotificationTypeIcon";

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  doneNotifications,
  markNotificationAsDone,
  markNotificationAsReadInternally,
  toggleNotificationSelection,
  isSelected,
}) => {
  // Handle notification link click - mark as read internally
  const handleNotificationClick = () => {
    if (!doneNotifications.has(notification.id)) {
      markNotificationAsReadInternally(notification.id);
    }
  };

  return (
    <li
      className={`${styles.notificationItem} 
        ${doneNotifications.has(notification.id) ? styles.done : ""}`}
      data-testid={`notification-item-${notification.id}`}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => toggleNotificationSelection(notification.id)}
        data-testid={`checkbox-${notification.id}`}
      />
      <span className={styles.notificationMain}>
        <NotificationTypeIcon
          notificationType={notification.subject.type}
          state={notification.details.state}
          isDraft={notification.details.draft}
        />
        <a
          target="_blank"
          href={notification.details.html_url}
          className={styles.notificationLink}
          onClick={handleNotificationClick}
        >
          {notification.subject.title}
        </a>
        <Labels labels={notification.details.labels} />
      </span>
      <button
        className={styles.itemDoneButton}
        onClick={() => markNotificationAsDone(notification.id)}
        data-testid={`mark-as-done-${notification.id}`}
      >
        <CheckIcon />
      </button>
    </li>
  );
};

export default NotificationItem;
