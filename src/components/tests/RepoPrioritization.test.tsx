import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import RepoPrioritization from '../RepoPrioritization';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { AppContext } from '../../store/AppContext';

describe('RepoPrioritization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with initial prioritized repos', () => {
    const { getByText } = render(
      <AppContext.Provider value={initialState}>
        <RepoPrioritization />
      </AppContext.Provider>
    );

    expect(getByText('Prioritize Repositories')).toBeInTheDocument();
    expect(getByText('repo1')).toBeInTheDocument();
    expect(getByText('repo2')).toBeInTheDocument();
  });

  it('adds a new repo when Add button is clicked', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <AppContext.Provider value={initialState}>
        <RepoPrioritization />
      </AppContext.Provider>
    );

    const input = getByPlaceholderText('Enter or select a repository');
    await userEvent.type(input, 'repo3');

    const addButton = getByTestId('addRepo');
    fireEvent.click(addButton);

    expect(input.value).toBe('');
  });

  it('renders options in datalist for all repo names', () => {
    const { container } = render(
      <AppContext.Provider value={initialState}>
        <RepoPrioritization />
      </AppContext.Provider>
    );

    const options = container.querySelectorAll('datalist option');
    expect(options.length).toBe(5);

    // Check that all options have the correct values
    const repoNames = ['repo1', 'repo2', 'repo3', 'repo4', 'org/repo5'];
    repoNames.forEach((repoName, index) => {
      const option = options[index] as HTMLOptionElement;
      expect(option.value).toBe(repoName);
    });
  });
});