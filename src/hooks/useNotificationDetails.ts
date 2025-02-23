import { useCallback } from 'react';

const useNotificationDetails = (token: string) => {
  const getNotificationDetails = useCallback(async (url: string) => {
    const response = await fetch(url, {
      headers: {
        Authorization: `token ${token}`
      }
    });
    const data = await response.json();
    return data;
  }, [token]);

  return { getNotificationDetails };
};

export default useNotificationDetails;
