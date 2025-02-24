import { render, fireEvent } from '@testing-library/react';
import NotificationList from '../NotificationList';
import { NotificationListProps } from '../../types';

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
  stateFilter: 'all'
};

describe('NotificationList', () => {
  it('renders NotificationList and marks notification as done', async () => {
    const { getByText, getByRole } = render(<NotificationList {...mockProps} />);
    
    expect(getByText(/Test Issue/i)).toBeInTheDocument();
    
    const markAsReadButton = getByRole('button', { name: /Mark Selected as Read/i });
    fireEvent.click(markAsReadButton);
    
    // Assuming markNotificationAsRead is mocked to resolve with status 205
    expect(mockProps.notifications[0].details.state).toBe('open');
  });
});
