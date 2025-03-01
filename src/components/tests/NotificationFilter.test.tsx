import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import NotificationFilter, { ValidFilters } from '../NotificationFilter';
import { describe, expect, it, vi } from 'vitest';

describe('NotificationFilter', () => {
  it('renders all filter options', () => {
    const setFilter = vi.fn();
    const { getByText } = render(
      <NotificationFilter setFilter={setFilter} activeFilter={null} />
    );
    
    expect(getByText('All')).toBeInTheDocument();
    expect(getByText('Pull Requests')).toBeInTheDocument();
    expect(getByText('Issues')).toBeInTheDocument();
  });

  it('applies active class to the selected filter', () => {
    const setFilter = vi.fn();
    const { getByText } = render(
      <NotificationFilter setFilter={setFilter} activeFilter="PullRequest" />
    );
    
    const pullRequestsLink = getByText('Pull Requests');
    expect(pullRequestsLink.className).toContain('active');
    
    const allLink = getByText('All');
    expect(allLink.className).not.toContain('active');
    
    const issuesLink = getByText('Issues');
    expect(issuesLink.className).not.toContain('active');
  });

  it('calls setFilter with the correct filter value when clicking on a filter', () => {
    const setFilter = vi.fn();
    const { getByText } = render(
      <NotificationFilter setFilter={setFilter} activeFilter={null} />
    );
    
    const pullRequestsLink = getByText('Pull Requests');
    fireEvent.click(pullRequestsLink);
    expect(setFilter).toHaveBeenCalledWith('PullRequest');
    
    const issuesLink = getByText('Issues');
    fireEvent.click(issuesLink);
    expect(setFilter).toHaveBeenCalledWith('Issue');
    
    const allLink = getByText('All');
    fireEvent.click(allLink);
    expect(setFilter).toHaveBeenCalledWith(null);
  });
}); 