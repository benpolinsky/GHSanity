import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../../App';

describe('App', () => {
  it('adds and removes repositories', () => {
    const { getByPlaceholderText, getByText, queryByText, getByTestId } = render(<App />);
    
    const gearIcon = getByTestId('gear-icon');
    fireEvent.click(gearIcon);

    const input = getByPlaceholderText(/Enter or select a repository/i);
    fireEvent.change(input, { target: { value: 'repo1' } });
    
    const addButton = getByTestId('addRepo');
    fireEvent.click(addButton);
    
    expect(getByText('repo1')).toBeInTheDocument();
    
    const removeButton = getByTestId("removeRepo-repo1")
    fireEvent.click(removeButton);
    
    expect(queryByText('repo1')).toBeNull();
  });

  it('filters labels', () => {
    const { getByPlaceholderText, getByText, getByRole, getByTestId, queryByText } = render(<App />);
    
    const gearIcon = getByTestId('gear-icon');
    fireEvent.click(gearIcon);

    const labelFilterInput = getByPlaceholderText(/Exclude by label/i);
    fireEvent.change(labelFilterInput, { target: { value: 'bug' } });
    
    const addLabelButton = getByTestId('addLabel');
    fireEvent.click(addLabelButton);
    
    expect(getByText('bug')).toBeInTheDocument();
    
    const removeLabelButton = getByRole('button', { name: /x/i });
    fireEvent.click(removeLabelButton);
    
    expect(queryByText('bug')).toBeNull();
  });
});
