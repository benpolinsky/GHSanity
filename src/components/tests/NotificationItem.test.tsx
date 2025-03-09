import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import NotificationItem from '../NotificationItem';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { AppContext } from '../../store/AppContext';

describe('NotificationItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a pull request notification with correct icon and state', () => {
    const { getByText, getByTestId } = render(
      <AppContext.Provider value={initialState}>
        <NotificationItem />
      </AppContext.Provider>
    );

    expect(getByText('Test Pull Request')).toBeInTheDocument();
    expect(getByText('bug')).toBeInTheDocument();
    const notificationItem = getByTestId(`notification-item-1`);
    expect(notificationItem).toBeInTheDocument();
    expect(notificationItem.innerHTML).toContain('iconOpen');
  });

  it('renders an issue notification with correct icon and state', () => {
    const { getByText, getByTestId } = render(
      <AppContext.Provider value={initialState}>
        <NotificationItem />
      </AppContext.Provider>
    );

    expect(getByText('Test Issue')).toBeInTheDocument();
    const notificationItem = getByTestId(`notification-item-2`);
    expect(notificationItem).toBeInTheDocument();
    expect(notificationItem.innerHTML).toContain('iconClosed');
  });

  it('renders a release notification', () => {
    const { getByText } = render(
      <AppContext.Provider value={initialState}>
        <NotificationItem />
      </AppContext.Provider>
    );

    expect(getByText('Test Release')).toBeInTheDocument();
  });

  it('calls markNotificationAsReadInternally when clicking the notification link', () => {
    const { getByText } = render(
      <AppContext.Provider value={initialState}>
        <NotificationItem />
      </AppContext.Provider>
    );

    const link = getByText('Test Pull Request');
    fireEvent.click(link);
    expect(markNotificationAsReadInternally).toHaveBeenCalledWith('1');
  });

  it('does not call markNotificationAsReadInternally if notification is already done', () => {
    const doneSet = new Set<string>(['1']);
    const { getByText } = render(
      <AppContext.Provider value={initialState}>
        <NotificationItem />
      </AppContext.Provider>
    );

    const link = getByText('Test Pull Request');
    fireEvent.click(link);
    expect(markNotificationAsReadInternally).not.toHaveBeenCalled();
  });

  it('calls markNotificationAsDone when clicking the mark as done button', () => {
    const { getByTestId } = render(
      <AppContext.Provider value={initialState}>
        <NotificationItem />
      </AppContext.Provider>
    );

    const doneButton = getByTestId(`mark-as-done-1`);
    fireEvent.click(doneButton);
    expect(markNotificationAsDone).toHaveBeenCalledWith('1');
  });

  it('calls toggleNotificationSelection when checking/unchecking the checkbox', () => {
    const { getByTestId } = render(
      <AppContext.Provider value={initialState}>
        <NotificationItem />
      </AppContext.Provider>
    );

    const checkbox = getByTestId(`checkbox-1`);
    fireEvent.click(checkbox);
    expect(toggleNotificationSelection).toHaveBeenCalledWith('1');
  });

  it('shows notification as done when in doneNotifications set', () => {
    const doneSet = new Set<string>(['1']);
    const { getByTestId } = render(
      <AppContext.Provider value={initialState}>
        <NotificationItem />
      </AppContext.Provider>
    );

    const notificationItem = getByTestId(`notification-item-1`);
    expect(notificationItem.className).toContain('done');
  });
});