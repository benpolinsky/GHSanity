import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import NotificationItem from '../NotificationItem';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { Notification } from '../../types';

describe('NotificationItem', () => {
  const mockPullRequestNotification: Notification = {
    id: '1',
    subject: { 
      type: 'PullRequest', 
      title: 'Test Pull Request', 
      url: 'https://api.github.com/repos/test/repo/pulls/1' 
    },
    repository: { full_name: 'test/repo' },
    reason: 'assign',
    details: { 
      state: 'open', 
      labels: [
        { id: 1, name: 'bug', color: 'f00', description: 'Bug report', url: 'https://github.com/labels/bug' }
      ] 
    }
  };

  const mockIssueNotification: Notification = {
    id: '2',
    subject: { 
      type: 'Issue', 
      title: 'Test Issue', 
      url: 'https://api.github.com/repos/test/repo/issues/2' 
    },
    repository: { full_name: 'test/repo' },
    reason: 'mention',
    details: { 
      state: 'closed', 
      labels: [] 
    }
  };

  const mockReleaseNotification: Notification = {
    id: '3',
    subject: { 
      type: 'Release', 
      title: 'Test Release', 
      url: 'https://api.github.com/repos/test/repo/releases/3' 
    },
    repository: { full_name: 'test/repo' },
    reason: 'participating',
    details: { 
      state: 'open', 
      labels: [] 
    }
  };

  const mockProps = {
    doneNotifications: new Set<string>(),
    markNotificationAsDone: vi.fn(),
    markNotificationAsReadInternally: vi.fn(),
    getWebsiteUrl: vi.fn().mockImplementation(url => url.replace('api.github.com/repos', 'github.com')),
    toggleNotificationSelection: vi.fn(),
    isSelected: false
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a pull request notification with correct icon and state', () => {
    const { getByText, getByTestId } = render(
      <NotificationItem
        notification={mockPullRequestNotification}
        {...mockProps}
      />
    );

    expect(getByText('Test Pull Request')).toBeInTheDocument();
    expect(getByText('bug')).toBeInTheDocument();
    const notificationItem = getByTestId(`notification-item-${mockPullRequestNotification.id}`);
    expect(notificationItem).toBeInTheDocument();
    expect(notificationItem.innerHTML).toContain('iconOpen');
  });

  it('renders an issue notification with correct icon and state', () => {
    const { getByText, getByTestId } = render(
      <NotificationItem
        notification={mockIssueNotification}
        {...mockProps}
      />
    );

    expect(getByText('Test Issue')).toBeInTheDocument();
    const notificationItem = getByTestId(`notification-item-${mockIssueNotification.id}`);
    expect(notificationItem).toBeInTheDocument();
    expect(notificationItem.innerHTML).toContain('iconClosed');
  });

  it('renders a release notification', () => {
    const { getByText } = render(
      <NotificationItem
        notification={mockReleaseNotification}
        {...mockProps}
      />
    );

    expect(getByText('Test Release')).toBeInTheDocument();
  });

  it('calls markNotificationAsReadInternally when clicking the notification link', () => {
    const { getByText } = render(
      <NotificationItem
        notification={mockPullRequestNotification}
        {...mockProps}
      />
    );

    const link = getByText('Test Pull Request');
    fireEvent.click(link);
    expect(mockProps.markNotificationAsReadInternally).toHaveBeenCalledWith(mockPullRequestNotification.id);
  });

  it('does not call markNotificationAsReadInternally if notification is already done', () => {
    const doneSet = new Set<string>([mockPullRequestNotification.id]);
    const markNotificationAsReadInternally = vi.fn();
    
    const { getByText } = render(
      <NotificationItem
        notification={mockPullRequestNotification}
        {...mockProps}
        doneNotifications={doneSet}
        markNotificationAsReadInternally={markNotificationAsReadInternally}
      />
    );

    const link = getByText('Test Pull Request');
    fireEvent.click(link);
    expect(markNotificationAsReadInternally).not.toHaveBeenCalled();
  });

  it('calls markNotificationAsDone when clicking the mark as done button', () => {
    const { getByTestId } = render(
      <NotificationItem
        notification={mockPullRequestNotification}
        {...mockProps}
      />
    );

    const doneButton = getByTestId(`mark-as-done-${mockPullRequestNotification.id}`);
    fireEvent.click(doneButton);
    expect(mockProps.markNotificationAsDone).toHaveBeenCalledWith(mockPullRequestNotification.id);
  });

  it('calls toggleNotificationSelection when checking/unchecking the checkbox', () => {
    const { getByTestId } = render(
      <NotificationItem
        notification={mockPullRequestNotification}
        {...mockProps}
      />
    );

    const checkbox = getByTestId(`checkbox-${mockPullRequestNotification.id}`);
    fireEvent.click(checkbox);
    expect(mockProps.toggleNotificationSelection).toHaveBeenCalledWith(mockPullRequestNotification.id);
  });

  it('shows notification as done when in doneNotifications set', () => {
    const doneSet = new Set<string>([mockPullRequestNotification.id]);
    const { getByTestId } = render(
      <NotificationItem
        notification={mockPullRequestNotification}
        {...mockProps}
        doneNotifications={doneSet}
      />
    );

    const notificationItem = getByTestId(`notification-item-${mockPullRequestNotification.id}`);
    expect(notificationItem.className).toContain('done');
  });
}); 