'use client';

import React from 'react';
import styles from './NotificationFilter.module.css';

export type ValidFilters = 'PullRequest' | 'Issue';

interface NotificationFilterProps {
  setFilter: React.Dispatch<React.SetStateAction<ValidFilters | null>>;
  activeFilter: ValidFilters | null;
}

const NotificationFilter: React.FC<NotificationFilterProps> = ({ setFilter, activeFilter }) => {
  return (
    <div className={styles.filterLinks}>
      <a href="#" className={activeFilter === null ? styles.active : ""} onClick={() => setFilter(null)}>All</a>
      <a href="#" className={activeFilter === "PullRequest" ? styles.active : ""} onClick={() => setFilter('PullRequest')}>Pull Requests</a>
      <a href="#" className={activeFilter === "Issue" ? styles.active : ""} onClick={() => setFilter('Issue')}>Issues</a>
    </div>
  );
};

export default NotificationFilter;
