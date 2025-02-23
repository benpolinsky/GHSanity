import React, { useState } from 'react';

interface RepoPrioritizationProps {
    prioritizedRepos: string[];
    setPrioritizedRepos: (repos: string[]) => void;
}

const RepoPrioritization: React.FC<RepoPrioritizationProps> = ({ prioritizedRepos, setPrioritizedRepos }) => {
    const [newRepo, setNewRepo] = useState('');

    const addRepo = () => {
        if (newRepo && !prioritizedRepos.includes(newRepo)) {
            setPrioritizedRepos([...prioritizedRepos, newRepo]);
            setNewRepo('');
        }
    };

    return (
        <div>
            <p>Repo Prioritization</p>
            <input
                type="text"
                value={newRepo}
                onChange={(e) => setNewRepo(e.target.value)}
                placeholder="Enter repository name"
            />
            <button onClick={addRepo}>Add</button>
            <ul>
                {prioritizedRepos.map((repo, index) => (
                    <li key={index}>{repo}</li>
                ))}
            </ul>
        </div>
    );
};

export default RepoPrioritization;
