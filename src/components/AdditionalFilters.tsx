import React, { useState } from 'react';
import styles from './AdditionalFilters.module.css';

interface AdditionalFiltersProps {
  setAdditionalFilter: React.Dispatch<React.SetStateAction<string | null>>;
  activeAdditionalFilter: string | null;
  notifications: Notification[];
  onFilterChange: (state: string) => void; // Add onFilterChange prop
}

const AdditionalFilters: React.FC<AdditionalFiltersProps> = ({ setAdditionalFilter, activeAdditionalFilter, notifications, onFilterChange }) => {
  console.log('Notifications:', notifications); // Debug log

  const filterCounts = notifications.reduce((acc, notification) => {
    const reason = notification.reason
    acc[reason] = (acc[reason] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('Filter Counts:', filterCounts); // Debug log

  const [state, setState] = useState('open');

  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setState(event.target.value);
    onFilterChange(event.target.value); // Call onFilterChange
  };

  return (
    <div className={styles.filterLinks}>
      <a href="#" className={activeAdditionalFilter === null ? styles.active : ""} onClick={() => setAdditionalFilter(null)}>
        All
      </a>
      <a href="#" className={activeAdditionalFilter === "assign" ? styles.active : ""} onClick={() => setAdditionalFilter('assign')}>
        Assigned {filterCounts['assign'] ? `(${filterCounts['assign']})` : ''}
      </a>
      <a href="#" className={activeAdditionalFilter === "participating" ? styles.active : ""} onClick={() => setAdditionalFilter('participating')}>
        Participating {filterCounts['participating'] ? `(${filterCounts['participating']})` : ''}
      </a>
      <a href="#" className={activeAdditionalFilter === "mention" ? styles.active : ""} onClick={() => setAdditionalFilter('mention')}>
        Mentioned {filterCounts['mention'] ? `(${filterCounts['mention']})` : ''}
      </a>
      <a href="#" className={activeAdditionalFilter === "team_mention" ? styles.active : ""} onClick={() => setAdditionalFilter('team_mention')}>
        Team Mentioned {filterCounts['team_mention'] ? `(${filterCounts['team_mention']})` : ''}
      </a>
      <a href="#" className={activeAdditionalFilter === "review_requested" ? styles.active : ""} onClick={() => setAdditionalFilter('review_requested')}>
        Review Requested {filterCounts['review_requested'] ? `(${filterCounts['review_requested']})` : ''}
      </a>
      <div>
        <label htmlFor="stateFilter">State:</label>
        <select id="stateFilter" value={state} onChange={handleStateChange}>
          <option value="all">All</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
      </div>
    </div>
  );
};

export default AdditionalFilters;
