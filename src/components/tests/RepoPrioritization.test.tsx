import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import RepoPrioritization from '../RepoPrioritization';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';

describe('RepoPrioritization', () => {
  const mockProps = {
    prioritizedRepos: ['repo1', 'repo2'],
    setPrioritizedRepos: vi.fn(),
    allRepoNames: ['repo1', 'repo2', 'repo3', 'repo4', 'org/repo5']
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with initial prioritized repos', () => {
    const { getByText } = render(<RepoPrioritization {...mockProps} />);
    
    expect(getByText('Prioritize Repositories')).toBeInTheDocument();
    expect(getByText('repo1')).toBeInTheDocument();
    expect(getByText('repo2')).toBeInTheDocument();
  });

  it('adds a new repo when Add button is clicked', async () => {
    const setPrioritizedReposMock = vi.fn();
    const { getByPlaceholderText, getByTestId } = render(
      <RepoPrioritization 
        {...mockProps} 
        setPrioritizedRepos={setPrioritizedReposMock}
      />
    );
    
    const input = getByPlaceholderText('Enter or select a repository');
    await userEvent.type(input, 'repo3');
    
    const addButton = getByTestId('addRepo');
    fireEvent.click(addButton);
    
    expect(setPrioritizedReposMock).toHaveBeenCalledWith([...mockProps.prioritizedRepos, 'repo3']);
  });

  it('does not add a duplicate repo', async () => {
    const setPrioritizedReposMock = vi.fn();
    const { getByPlaceholderText, getByTestId } = render(
      <RepoPrioritization 
        {...mockProps} 
        setPrioritizedRepos={setPrioritizedReposMock}
      />
    );
    
    const input = getByPlaceholderText('Enter or select a repository');
    await userEvent.type(input, 'repo1');
    
    // Clear previous mock calls
    setPrioritizedReposMock.mockClear();
    
    const addButton = getByTestId('addRepo');
    fireEvent.click(addButton);
    
    expect(setPrioritizedReposMock).not.toHaveBeenCalled();
  });

  it('does not add an empty repo name', () => {
    const setPrioritizedReposMock = vi.fn();
    const { getByTestId } = render(
      <RepoPrioritization 
        {...mockProps} 
        setPrioritizedRepos={setPrioritizedReposMock}
      />
    );
    
    // Clear previous mock calls
    setPrioritizedReposMock.mockClear();
    
    const addButton = getByTestId('addRepo');
    fireEvent.click(addButton);
    
    expect(setPrioritizedReposMock).not.toHaveBeenCalled();
  });

  it('removes a repo when Remove button is clicked', () => {
    const setPrioritizedReposMock = vi.fn();
    const { getByTestId } = render(
      <RepoPrioritization 
        {...mockProps} 
        setPrioritizedRepos={setPrioritizedReposMock}
      />
    );
    
    const removeButton = getByTestId('removeRepo-repo1');
    fireEvent.click(removeButton);
    
    expect(setPrioritizedReposMock).toHaveBeenCalledWith(['repo2']);
  });

  it('clears input after adding a repo', async () => {
    const { getByPlaceholderText, getByTestId } = render(<RepoPrioritization {...mockProps} />);
    
    const input = getByPlaceholderText('Enter or select a repository') as HTMLInputElement;
    await userEvent.type(input, 'repo3');
    
    const addButton = getByTestId('addRepo');
    fireEvent.click(addButton);
    
    expect(input.value).toBe('');
  });

  it('renders options in datalist for all repo names', () => {
    const { container } = render(<RepoPrioritization {...mockProps} />);
    
    const options = container.querySelectorAll('datalist option');
    expect(options.length).toBe(mockProps.allRepoNames.length);
    
    // Check that all options have the correct values
    mockProps.allRepoNames.forEach((repoName, index) => {
      const option = options[index] as HTMLOptionElement;
      expect(option.value).toBe(repoName);
    });
  });
}); 