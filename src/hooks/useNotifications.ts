"use client";

import { useCallback } from "react";
import { getNotificationDetails, getNotifications } from "@/app/api/github";
import { Notification } from "../types";

const useNotifications = (token: string, dispatch: any) => {
  const setLoading = useCallback(
    (isLoading: boolean) => {
      dispatch({ type: "SET_IS_LOADING", payload: isLoading });
    },
    [dispatch],
  );

  const setError = useCallback(
    (errorStr: string, error?: unknown) => {
      dispatch({ type: "SET_ERROR", payload: errorStr });
      if (error) console.error(error);
    },
    [dispatch],
  );

  const fetchNotifications = useCallback(async () => {
    const addDetails = (notifications: Notification[]) => {
      return Promise.all(
        notifications.map(async (notification: Notification) => {
          const details = await getNotificationDetails(
            notification.subject.url,
            token,
          );
          return { ...notification, details };
        }),
      );
    };

    try {
      setLoading(true);
      const data = await getNotifications(token);
      if (data.status === 200) {
        const detailedNotifications = await addDetails(data.json);
        dispatch({ type: "SET_NOTIFICATIONS", payload: detailedNotifications });
      } else {
        setError("Failed to fetch notifications");
      }
    } catch (err: unknown) {
      setError("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  }, [token, dispatch, setError, setLoading]);

  return { fetchNotifications };
};

export default useNotifications;
