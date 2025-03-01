import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AdditionalFilters from '../AdditionalFilters';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { Notification } from '../../types';

describe('AdditionalFilters', () => {
  const mockNotifications: Notification[] = [
    {
      id: '1',
      subject: { type: 'Issue', title: 'Test Issue 1', url: 'https://api.github.com/repos/test/repo/issues/1' },
      repository: { full_name: 'test/repo' },
      reason: 'assign',
      details: { state: 'open', labels: [] }
    },
    {
      id: '2',
      subject: { type: 'PullRequest', title: 'Test PR 1', url: 'https://api.github.com/repos/test/repo/pulls/2' },
      repository: { full_name: 'test/repo' },
      reason: 'mention',
      details: { state: 'open', labels: [] }
    },
    {
      id: '3',
      subject: { type: 'Issue', title: 'Test Issue 2', url: 'https://api.github.com/repos/test/repo/issues/3' },
      repository: { full_name: 'test/repo' },
      reason: 'review_requested',
      details: { state: 'closed', labels: [] }
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all filter options with counts', () => {
    const setAdditionalFilter = vi.fn();
    const onFilterChange = vi.fn();
    
    const { getAllByText, getByText } = render(
      <AdditionalFilters 
        setAdditionalFilter={setAdditionalFilter} 
        activeAdditionalFilter={null} 
        notifications={mockNotifications}
        onFilterChange={onFilterChange}
      />
    );
    
    const allLinks = getAllByText('All');
    expect(allLinks.some(el => el.tagName === 'A')).toBeTruthy();
    
    expect(getByText('Assigned (1)')).toBeInTheDocument();
    expect(getByText('Mentioned (1)')).toBeInTheDocument();
    expect(getByText('Review Requested (1)')).toBeInTheDocument();
    expect(getByText('Participating')).toBeInTheDocument();
    expect(getByText('Team Mentioned')).toBeInTheDocument();
  });

  it('applies active class to the selected filter', () => {
    const setAdditionalFilter = vi.fn();
    const onFilterChange = vi.fn();
    
    const { getByText, getAllByText } = render(
      <AdditionalFilters 
        setAdditionalFilter={setAdditionalFilter} 
        activeAdditionalFilter="assign" 
        notifications={mockNotifications}
        onFilterChange={onFilterChange}
      />
    );
    
    const assignedLink = getByText('Assigned (1)');
    expect(assignedLink.className).toContain('active');
    
    const allLinks = getAllByText('All');
    const allLink = allLinks.find(el => el.tagName === 'A');
    expect(allLink?.className).not.toContain('active');
  });

  it('calls setAdditionalFilter with the correct value when clicking a filter', () => {
    const setAdditionalFilter = vi.fn();
    const onFilterChange = vi.fn();
    
    const { getByText } = render(
      <AdditionalFilters 
        setAdditionalFilter={setAdditionalFilter} 
        activeAdditionalFilter={null} 
        notifications={mockNotifications}
        onFilterChange={onFilterChange}
      />
    );
    
    const assignedLink = getByText('Assigned (1)');
    fireEvent.click(assignedLink);
    expect(setAdditionalFilter).toHaveBeenCalledWith('assign');
    
    const mentionedLink = getByText('Mentioned (1)');
    fireEvent.click(mentionedLink);
    expect(setAdditionalFilter).toHaveBeenCalledWith('mention');
  });

  it('calls onFilterChange when changing the state filter', () => {
    const setAdditionalFilter = vi.fn();
    const onFilterChange = vi.fn();
    
    const { getByLabelText } = render(
      <AdditionalFilters 
        setAdditionalFilter={setAdditionalFilter} 
        activeAdditionalFilter={null} 
        notifications={mockNotifications}
        onFilterChange={onFilterChange}
      />
    );
    
    const stateSelect = getByLabelText('State:') as HTMLSelectElement;
    
    fireEvent.change(stateSelect, { target: { value: 'closed' } });
    expect(onFilterChange).toHaveBeenCalledWith('closed');
    
    fireEvent.change(stateSelect, { target: { value: 'all' } });
    expect(onFilterChange).toHaveBeenCalledWith('all');
  });
}); 