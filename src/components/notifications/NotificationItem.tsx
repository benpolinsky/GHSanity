"use client";

import React from "react";
import styles from "./NotificationList.module.css";
import { CheckIcon } from "../icons";
import Labels from "./Labels";
import { NotificationItemProps } from "../../types";
import NotificationTypeIcon from "./NotificationTypeIcon";

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  doneNotifications,
  markNotificationAsDone,
  markNotificationAsReadInternally,
  toggleNotificationSelection,
  isSelected,
  animationIndex = 0,
}) => {
  const isDone = doneNotifications.has(notification.id);

  const handleNotificationClick = () => {
    if (!isDone) {
      markNotificationAsReadInternally(notification.id);
    }
  };

  const stateLabel = notification.details.draft
    ? "draft"
    : notification.details.state || "";

  const stateClass = notification.details.draft
    ? styles.stateDraft
    : stateLabel.includes("closed")
      ? styles.stateClosed
      : stateLabel === "merged"
        ? styles.stateMerged
        : styles.stateOpen;

  const delay = animationIndex < 10 ? `${animationIndex * 25}ms` : "0ms";

  return (
    <li
      className={`${styles.row} ${isDone ? styles.done : ""}`}
      style={{ animationDelay: delay }}
      data-testid={`notification-item-${notification.id}`}
    >
      <input
        type="checkbox"
        className={styles.checkbox}
        checked={isSelected}
        onChange={() => toggleNotificationSelection(notification.id)}
        data-testid={`checkbox-${notification.id}`}
      />
      <NotificationTypeIcon
        notificationType={notification.subject.type}
        state={notification.details.state}
        isDraft={notification.details.draft}
      />
      <a
        target="_blank"
        href={notification.details.html_url}
        className={styles.title}
        title={notification.subject.title}
        onClick={handleNotificationClick}
        rel="noreferrer"
      >
        {notification.subject.title}
      </a>
      <Labels labels={notification.details.labels} />
      {stateLabel && (
        <span className={`${styles.stateBadge} ${stateClass}`}>
          {stateLabel}
        </span>
      )}
      <button
        className={styles.quickAction}
        onClick={() => markNotificationAsDone(notification.id)}
        data-testid={`mark-as-done-${notification.id}`}
        aria-label="Mark as read"
      >
        <CheckIcon className={styles.checkIcon} />
      </button>
    </li>
  );
};

export default NotificationItem;
