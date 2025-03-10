'use client';

import React, { useContext } from 'react';
import styles from './NotificationTypeFilter.module.css';
import { AppContext, AppDispatchContext } from '@/store/AppContext';
import { NotificationType } from '@/types';

const NotificationTypeFilter = () => {
  const { typeFilter } = useContext(AppContext);
  const dispatch = useContext(AppDispatchContext);
  const dispatchFilter = (filter: NotificationType | null) => dispatch({ type: 'SET_FILTER', payload: filter });

  return (
    <div className={styles.filterLinks}>
      <a href="#" className={typeFilter === null ? styles.active : ""} onClick={() => dispatchFilter(null)}>All</a>
      <a href="#" className={typeFilter === "PullRequest" ? styles.active : ""} onClick={() => dispatchFilter('PullRequest')}>Pull Requests</a>
      <a href="#" className={typeFilter === "Issue" ? styles.active : ""} onClick={() => dispatchFilter('Issue')}>Issues</a>
      <a href="#" className={typeFilter === "Release" ? styles.active : ""} onClick={() => dispatchFilter('Release')}>Release</a>
    </div>
  );
};

export default NotificationTypeFilter;
