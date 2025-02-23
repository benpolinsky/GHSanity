import React from 'react';
import styles from './NotificationFilter.module.css';

export type ValidFilters = 'PullRequest' | 'Issue';

interface NotificationFilterProps {
  setFilter: React.Dispatch<React.SetStateAction<ValidFilters | null>>;
  activeFilter: ValidFilters | null;
}

const NotificationFilter: React.FC<NotificationFilterProps> = ({ setFilter, activeFilter }) => {
  return (
    <div className={styles.filterButtons}>
      <button className={activeFilter === null ? styles.active : ""}onClick={() => setFilter(null)}>All</button>
      <button className={activeFilter === "PullRequest" ? styles.active : ""}onClick={() => setFilter('PullRequest')}>Pull Requests</button>
      <button className={activeFilter === "Issue" ? styles.active : ""}onClick={() => setFilter('Issue')}>Issues</button>
    </div>
  );
};

export default NotificationFilter;
