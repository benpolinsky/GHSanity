'use client';

import React, { useContext } from 'react';
import styles from './NotificationFilter.module.css';
import { AppContext, AppDispatchContext } from '@/store/AppContext';

export type ValidFilters = 'PullRequest' | 'Issue';

const NotificationFilter = () => {
  const { filter } = useContext(AppContext);
  const dispatch = useContext(AppDispatchContext);
  const dispatchFilter = (filter: ValidFilters | null) => dispatch({ type: 'SET_FILTER', payload: filter });

  return (
    <div className={styles.filterLinks}>
      <a href="#" className={filter === null ? styles.active : ""} onClick={() => dispatchFilter(null)}>All</a>
      <a href="#" className={filter === "PullRequest" ? styles.active : ""} onClick={() => dispatchFilter('PullRequest')}>Pull Requests</a>
      <a href="#" className={filter === "Issue" ? styles.active : ""} onClick={() => dispatchFilter('Issue')}>Issues</a>
    </div>
  );
};

export default NotificationFilter;
