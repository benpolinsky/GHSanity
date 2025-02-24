import React, { useState } from 'react';
import { RepoPrioritizationProps } from '../types'; // Import consolidated types

const RepoPrioritization: React.FC<RepoPrioritizationProps> = ({ prioritizedRepos, setPrioritizedRepos, allRepoNames }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleAddRepo = () => {
    if (inputValue && !prioritizedRepos.includes(inputValue)) {
      setPrioritizedRepos([...prioritizedRepos, inputValue]);
      setInputValue('');
    }
  };

  const handleRemoveRepo = (repo: string) => {
    setPrioritizedRepos(prioritizedRepos.filter(r => r !== repo));
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
