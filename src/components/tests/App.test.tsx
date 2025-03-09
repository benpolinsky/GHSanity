import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest';
import { AppContent } from '../AppContent';

// Mock the GitHub API calls
vi.mock('../../app/api/github', () => ({
  getNotifications: vi.fn().mockResolvedValue({
    status: 200,
    json: []
  })
}));

// Mock the notification details hook
vi.mock('../../hooks/useNotificationDetails', () => ({
  default: () => ({
    getNotificationDetails: vi.fn().mockResolvedValue({})
  })
}));

// Mock createPortal for testing
vi.mock('react-dom', async () => {
  const originalModule = await vi.importActual('react-dom');
  return {
    ...originalModule,
    createPortal: (node: React.ReactNode) => node,
  };
});

describe('AppContent', () => {
  it('adds and removes repositories', async () => {
    const { getByPlaceholderText, findByText, queryByText, getByTestId } = render(<AppContent />);

    const gearIcon = getByTestId('gear-icon');
    await userEvent.click(gearIcon);

    const input = getByPlaceholderText(/Enter or select a repository/i);
    await userEvent.type(input, 'repo1');

    const addButton = getByTestId('addRepo');
    await userEvent.click(addButton);

    await findByText('repo1');

    const removeButton = getByTestId("removeRepo-repo1")
    await userEvent.click(removeButton);

    expect(queryByText('repo1')).toBeNull();
  });

  it('filters labels', async () => {
    const { getByPlaceholderText, getByText, getByRole, getByTestId, queryByText } = render(<AppContent />);

    const gearIcon = getByTestId('gear-icon');
    await userEvent.click(gearIcon);

    const labelFilterInput = getByPlaceholderText(/Exclude by label/i);
    await userEvent.type(labelFilterInput, 'bug');

    const addLabelButton = getByTestId('addLabel');
    await userEvent.click(addLabelButton);

    expect(getByText('bug')).toBeInTheDocument();

    const removeLabelButton = getByRole('button', { name: /x/i });
    await userEvent.click(removeLabelButton);

    expect(queryByText('bug')).toBeNull();
  });
});
