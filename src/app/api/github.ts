"use client";

const GITHUB_API_URL = "https://api.github.com";
import { Notification } from "../../types";

// Helper function to parse Link header
const parseLinkHeader = (linkHeader: string | null): Record<string, string> => {
  if (!linkHeader) return {};

  return linkHeader.split(",").reduce((acc: Record<string, string>, link) => {
    const match = link.match(/<([^>]+)>;\s*rel="([^"]+)"/);
    if (match) {
      acc[match[2]] = match[1];
    }
    return acc;
  }, {});
};

export const getNotifications = async (token: string) => {
  let allNotifications: Notification[] = [];
  let nextUrl = `${GITHUB_API_URL}/notifications?per_page=100`;
  let status = 0;

  while (nextUrl) {
    const response = await fetch(nextUrl, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      // Add cache: 'no-store' to ensure fresh data
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch notifications: ${response.status} ${response.statusText}`,
      );
    }

    status = response.status;
    const json = await response.json();
    allNotifications = [...allNotifications, ...json];

    // Check for pagination links
    const linkHeader = response.headers.get("Link");
    const links = parseLinkHeader(linkHeader);
    nextUrl = links["next"] || "";
  }

  return { json: allNotifications, status };
};

export const getNotificationDetails = async (url: string, token: string) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-store",
  });
  const data = await response.json();
  return data;
};

export const markNotificationAsRead = async (notificationId: string) => {
  const token = process.env.NEXT_GH_TOKEN || "";
  const response = await fetch(
    `${GITHUB_API_URL}/notifications/threads/${notificationId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      cache: "no-store",
    },
  );
  if (!response.ok) {
    throw new Error(
      `Failed to mark notification as read: ${response.status} ${response.statusText}`,
    );
  }
  return response;
};

export const markRepoNotificationsAsRead = async (
  token: string,
  repoFullName: string,
) => {
  const [owner, repo] = repoFullName.split("/");
  const response = await fetch(
    `${GITHUB_API_URL}/repos/${owner}/${repo}/notifications`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        last_read_at: new Date().toISOString(),
        read: true,
      }),
      cache: "no-store",
    },
  );
  if (!response.ok) {
    throw new Error(
      `Failed to mark repo notifications as read: ${response.status} ${response.statusText}`,
    );
  }
  return response;
};
