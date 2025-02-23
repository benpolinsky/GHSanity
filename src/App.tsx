import React from 'react';
import NotificationList from './components/NotificationList';
import './App.css';
import RateLimit from './RateLimit';

const App: React.FC = () => {
  const token = import.meta.env.VITE_GITHUB_TOKEN; // Use Vite environment variable for GitHub token
  return (
    <>
      {/* <RateLimit /> */}
      <NotificationList token={token} prioritizedRepos={["iTwin/itwinjs-core", "iTwin/coordinate-reference-system-service"]}/>
    </>
  );
};

export default App;
