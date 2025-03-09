import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NotificationList from '../NotificationList';
import { describe, expect, it, vi } from 'vitest';
import { AppContext } from '../../store/AppContext';

vi.mock('../../api/github', () => ({
  markNotificationAsRead: vi.fn().mockResolvedValue({ status: 205 }),
  markRepoNotificationsAsRead: vi.fn().mockResolvedValue({ status: 205 })
}));

describe('NotificationList', () => {
  it('renders NotificationList and marks notification as done', async () => {
    const { getByText, getByRole } = render(
      <AppContext.Provider value={initialState}>
        <NotificationList />
      </AppContext.Provider>
    );

    expect(getByText(/Test Issue/i)).toBeInTheDocument();

    const markAsReadButton = getByRole('button', { name: /Mark Selected as Read/i });
    await userEvent.click(markAsReadButton);

    // Assuming markNotificationAsRead is mocked to resolve with status 205
    expect(mockProps.notifications[0].details.state).toBe('open');
  });
});
