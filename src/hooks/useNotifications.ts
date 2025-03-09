'use client';

import { useCallback } from 'react';
import { getNotifications } from "@/app/api/github";
import { Notification } from '../types';

const useNotifications = (token: string, dispatch: React.Dispatch<any>) => {
    const getNotificationDetails = useCallback(async (url: string) => {
        const response = await fetch(url, {
            headers: {
                Authorization: `token ${token}`,
                Accept: 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28'
            },
            cache: 'no-store'
        });
        const data = await response.json();
        return data;
    }, [token]);

    const addDetails = (notifications: Notification[]) => {
        return Promise.all(notifications.map(async (notification: Notification) => {
            const details = await getNotificationDetails(
                notification.subject.url
            );
            return { ...notification, details };
        })
        )
    }

    const setLoading = useCallback((isLoading: boolean) => {
        dispatch({ type: "SET_IS_LOADING", payload: isLoading });
    }, [dispatch]);

    const setError = useCallback((error: string) => {
        dispatch({ type: "SET_ERROR", payload: error });
        console.error(error);
    }, [dispatch]);

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getNotifications(token);
            if (data.status === 200) {
                const detailedNotifications = await addDetails(data.json);
                dispatch({ type: "SET_NOTIFICATIONS", payload: detailedNotifications });
            } else {
                setError("Failed to fetch notifications");
            }
        } catch (err) {
            setError("Failed to fetch notifications");
        } finally {
            setLoading(false);
        }
    }, [token, getNotificationDetails, dispatch]);

    return { fetchNotifications };
};

export default useNotifications;
