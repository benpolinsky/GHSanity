'use client';

import React, { useContext } from 'react';
import styles from './AdditionalFilters.module.css';
import { AppContext, AppDispatchContext } from '@/store/AppContext';

const SelectFilter: React.FC<{ filter: string | null, label: string }> = ({ filter, label }) => {
  const { additionalFilter, notifications } = useContext(AppContext);
  const dispatch = useContext(AppDispatchContext);

  const filterCounts = notifications.reduce((acc, notification) => {
    const reason = notification.reason
    acc[reason] = (acc[reason] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleFilterChange = (filter: string | null) => {
    dispatch({ type: "SET_ADDITIONAL_FILTER", payload: filter });
  };

  return (
    <a href="#" className={additionalFilter === filter ? styles.active : ""} onClick={() => handleFilterChange(filter)}>
      {label} {filterCounts[filter!] ? `(${filterCounts[filter!]})` : ''}
    </a>
  );
};

const AdditionalFilters = () => {
  const { stateFilter } = useContext(AppContext);
  const dispatch = useContext(AppDispatchContext);

  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: "SET_STATE_FILTER", payload: event.target.value }); // Call dispatch
  };

  return (
    <div className={styles.filterLinks}>
      <SelectFilter filter={null} label="All" />
      <SelectFilter filter="assign" label="Assigned" />
      <SelectFilter filter="participating" label="Participating" />
      <SelectFilter filter="mention" label="Mentioned" />
      <SelectFilter filter="team_mention" label="Team Mentioned" />
      <SelectFilter filter="review_requested" label="Review Requested" />

      <div>
        <label htmlFor="stateFilter">State:</label>
        <select id="stateFilter" value={stateFilter} onChange={handleStateChange}>
          <option value="all">All</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
      </div>
    </div>
  );
};

export default AdditionalFilters;
