'use client';

import React, { useState, useContext } from 'react';
import { AppContext, AppDispatchContext } from '@/store/AppContext';

const RepoPrioritization = () => {
  const { prioritizedRepos, notifications } = useContext(AppContext);
  const dispatch = useContext(AppDispatchContext);
  const [inputValue, setInputValue] = useState('');
  const allRepoNames = Array.from(new Set(notifications.map(notification => notification.repository.full_name)));

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleAddRepo = () => {
    if (inputValue && !prioritizedRepos.includes(inputValue)) {
      dispatch({ type: "SET_PRIORITIZED_REPOS", payload: [...prioritizedRepos, inputValue] });
      setInputValue('');
    }
  };

  const handleRemoveRepo = (repo: string) => {
    dispatch({ type: "SET_PRIORITIZED_REPOS", payload: prioritizedRepos.filter(r => r !== repo) });
  };

  return (
    <div>
      <h3>Prioritize Repositories</h3>
      <input
        list="repo-names"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Enter or select a repository"
      />
      <datalist id="repo-names">
        {allRepoNames.map(repoName => (
          <option key={repoName} value={repoName} />
        ))}
      </datalist>
      <button data-testid="addRepo" onClick={handleAddRepo}>Add</button>
      <ul>
        {prioritizedRepos.map(repo => (
          <li key={repo}>
            {repo}
            <button data-testid={`removeRepo-${repo}`} onClick={() => handleRemoveRepo(repo)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RepoPrioritization;
