const GITHUB_API_URL = 'https://api.github.com';

export const getNotifications = async (token: string) => {
  const response = await fetch(`${GITHUB_API_URL}/notifications`, {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch notifications: ${response.status} ${response.statusText}`);
  }
  const json = await response.json();
  return { json: json, status: response.status };
};

export const markNotificationAsRead = async (token: string, notificationId: string) => {
  const response = await fetch(`${GITHUB_API_URL}/notifications/threads/${notificationId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to mark notification as read: ${response.status} ${response.statusText}`);
  }
  return response;
};

export const markRepoNotificationsAsRead = async (token: string, repoFullName: string) => {
  const [owner, repo] = repoFullName.split('/');
  const response = await fetch(`${GITHUB_API_URL}/repos/${owner}/${repo}/notifications`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      last_read_at: new Date().toISOString(),
      read: true,
    }),
  });
  if (!response.ok) {
    throw new Error(`Failed to mark repo notifications as read: ${response.status} ${response.statusText}`);
  }
  return response;
};
