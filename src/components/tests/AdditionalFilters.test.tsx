import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AdditionalFilters from '../AdditionalFilters';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { AppContext } from '../../store/AppContext';

describe('AdditionalFilters', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all filter options with counts', () => {
    const { getAllByText, getByText } = render(
      <AppContext.Provider value={initialState}>
        <AdditionalFilters />
      </AppContext.Provider>
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
    const { getByText, getAllByText } = render(
      <AppContext.Provider value={initialState}>
        <AdditionalFilters />
      </AppContext.Provider>
    );

    const assignedLink = getByText('Assigned (1)');
    expect(assignedLink.className).toContain('active');

    const allLinks = getAllByText('All');
    const allLink = allLinks.find(el => el.tagName === 'A');
    expect(allLink?.className).not.toContain('active');
  });

  it('calls setAdditionalFilter with the correct value when clicking a filter', () => {
    const { getByText } = render(
      <AppContext.Provider value={initialState}>
        <AdditionalFilters />
      </AppContext.Provider>
    );

    const assignedLink = getByText('Assigned (1)');
    fireEvent.click(assignedLink);
    expect(setAdditionalFilter).toHaveBeenCalledWith('assign');

    const mentionedLink = getByText('Mentioned (1)');
    fireEvent.click(mentionedLink);
    expect(setAdditionalFilter).toHaveBeenCalledWith('mention');
  });

  it('calls onFilterChange when changing the state filter', () => {
    const { getByLabelText } = render(
      <AppContext.Provider value={initialState}>
        <AdditionalFilters />
      </AppContext.Provider>
    );

    const stateSelect = getByLabelText('State:') as HTMLSelectElement;
    fireEvent.change(stateSelect, { target: { value: 'closed' } });
    expect(onFilterChange).toHaveBeenCalledWith('closed');

    fireEvent.change(stateSelect, { target: { value: 'all' } });
    expect(onFilterChange).toHaveBeenCalledWith('all');
  });
});