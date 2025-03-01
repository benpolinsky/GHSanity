'use client';

import { useCallback } from 'react';

const useNotificationDetails = (token: string) => {
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

  return { getNotificationDetails };
};

export default useNotificationDetails;
