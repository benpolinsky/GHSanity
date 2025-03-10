'use client';

import React, { useState, useContext } from 'react';
import { AppContext, AppDispatchContext } from '@/store/AppContext';
import ComboboxComponent from './ComboboxComponent';
import Token from './Token';
import TokenContainer from './TokenContainer'; // Import the new component
import styles from './LabelFilter.module.css'; // Use existing styles
import '@reach/combobox/styles.css';

const RepoPrioritization = () => {
  const { prioritizedRepos, notifications } = useContext(AppContext);
  const dispatch = useContext(AppDispatchContext);
  const [inputValue, setInputValue] = useState('');
  const allRepoNames = Array.from(new Set(notifications.map(notification => notification.repository.full_name)));

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleAddRepo = (repo: string) => {
    if (repo && !prioritizedRepos.includes(repo)) {
      dispatch({ type: "SET_PRIORITIZED_REPOS", payload: [...prioritizedRepos, repo] });
      setInputValue('');
    }
  };

  const handleRemoveRepo = (repo: string) => {
    dispatch({ type: "SET_PRIORITIZED_REPOS", payload: prioritizedRepos.filter(r => r !== repo) });
  };

  return (
    <div>
      <p>Prioritize Repositories</p>
      <div>
        <ComboboxComponent
          inputValue={inputValue}
          setInputValue={setInputValue}
          options={allRepoNames}
          onSelect={handleAddRepo} // Fix the onSelect prop
          placeholder="Enter or select a repository"
          buttonText="Add"
        />
      </div>
      <TokenContainer tokens={prioritizedRepos} onRemove={handleRemoveRepo} />
    </div>
  );
};

export default RepoPrioritization;
