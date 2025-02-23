import React, { useEffect, useState } from 'react';
import NotificationList from './components/NotificationList';
import SettingsPane from './components/SettingsPane';
import { getNotifications } from './api/github';
import useNotificationDetails from './hooks/useNotificationDetails';
import './App.css';

const App: React.FC = () => {
    const token = import.meta.env.VITE_GITHUB_TOKEN; // Use Vite environment variable for GitHub token
    const [notifications, setNotifications] = useState([]);
    const [labelFilters, setLabelFilters] = useState<string[]>([]);
    const [prioritizedRepos, setPrioritizedRepos] = useState<string[]>(["iTwin/itwinjs-core", "iTwin/coordinate-reference-system-service"]);
    const [error, setError] = useState<string | null>(null);
    const { getNotificationDetails } = useNotificationDetails(token);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await getNotifications(token);
                if (data.status === 200) {
                    const detailedNotifications = await Promise.all(data.json.map(async (notification: any) => {
                        const details = await getNotificationDetails(notification.subject.url);
                        return { ...notification, details };
                    }));
                    setNotifications(detailedNotifications);
                } else {
                    console.error(data);
                    setError('Failed to fetch notifications');
                }
            } catch (err) {
                setError('Failed to fetch notifications');
                console.error(err);
            }
        };
        fetchNotifications().then(() => console.log("fetched"))
    }, [token, getNotificationDetails]);

    const allLabels = Array.from(new Set(notifications.flatMap(notification => notification.details.labels.map((label: any) => label.name))));

    return (
        <>
            <SettingsPane
                labelFilters={labelFilters}
                setLabelFilters={setLabelFilters}
                allLabels={allLabels}
                prioritizedRepos={prioritizedRepos}
                setPrioritizedRepos={setPrioritizedRepos}
            />
            <NotificationList
                token={token}
                notifications={notifications}
                labelFilters={labelFilters}
                prioritizedRepos={prioritizedRepos}
                error={error}
            />
        </>
    );
};

export default App;
