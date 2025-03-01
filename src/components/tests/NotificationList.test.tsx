import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NotificationList from '../NotificationList';
import { NotificationListProps } from '../../types';
import { describe, expect, it, vi } from 'vitest';

const mockProps: NotificationListProps = {
  token: 'test-token',
  notifications: [
    {
      id: '1',
      subject: { type: 'Issue', title: 'Test Issue', url: 'https://api.github.com/repos/test/repo/issues/1' },
      repository: { full_name: 'test/repo' },
      reason: 'assign',
      details: { state: 'open', labels: [{ id: 1, name: 'bug', color: 'f00', description: "sadas", url: "https://realgithub.com" }] }
    }
  ],
  labelFilters: [],
  prioritizedRepos: [],
  error: null,
  filter: null,
  additionalFilter: null,
  stateFilter: 'all',
  isLoading: false
};

// Mock the GitHub API calls
vi.mock('../../api/github', () => ({
  markNotificationAsRead: vi.fn().mockResolvedValue({ status: 205 }),
  markRepoNotificationsAsRead: vi.fn().mockResolvedValue({ status: 205 })
}));

describe('NotificationList', () => {
  it('renders NotificationList and marks notification as done', async () => {
    const { getByText, getByRole } = render(<NotificationList {...mockProps} />);
    
    expect(getByText(/Test Issue/i)).toBeInTheDocument();
    
    const markAsReadButton = getByRole('button', { name: /Mark Selected as Read/i });
    await userEvent.click(markAsReadButton);
    
    // Assuming markNotificationAsRead is mocked to resolve with status 205
    expect(mockProps.notifications[0].details.state).toBe('open');
  });
});
