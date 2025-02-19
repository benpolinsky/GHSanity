import React from 'react';
import NotificationList from './components/NotificationList';
import './App.css';

const App: React.FC = () => {
  const token = import.meta.env.VITE_GITHUB_TOKEN; // Use Vite environment variable for GitHub token

  return (
    <div className="App">
      <h1>GitHub Notifications</h1>
      <NotificationList token={token} />
    </div>
  );
};

export default App;
