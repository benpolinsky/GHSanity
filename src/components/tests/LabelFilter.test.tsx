import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import LabelFilter from '../LabelFilter';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';

// Mock the combobox component for testing
vi.mock('@reach/combobox', () => ({
  Combobox: ({ children, onSelect }: { children: React.ReactNode, onSelect: (value: string) => void }) => (
    <div data-testid="mock-combobox" onClick={() => onSelect('mocked-selection')}>
      {children}
    </div>
  ),
  ComboboxInput: ({ value, onChange, placeholder }: { value: string, onChange: (e: any) => void, placeholder: string }) => (
    <input
      data-testid="combobox-input"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  ),
  ComboboxPopover: ({ children }: { children: React.ReactNode }) => <div data-testid="combobox-popover">{children}</div>,
  ComboboxList: ({ children }: { children: React.ReactNode }) => <ul data-testid="combobox-list">{children}</ul>,
  ComboboxOption: ({ value }: { value: string }) => <li data-testid={`combobox-option-${value}`}>{value}</li>
}));

describe('LabelFilter', () => {
  const mockProps = {
    labelFilters: ['bug', 'enhancement'],
    setLabelFilters: vi.fn(),
    allLabels: ['bug', 'enhancement', 'documentation', 'help wanted', 'question']
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with initial label filters', () => {
    const { getByText, getAllByText, container } = render(<LabelFilter {...mockProps} />);
    
    expect(getByText('Label Filter')).toBeInTheDocument();
    
    // Just check that the labels are rendered
    expect(getAllByText('bug').length).toBeGreaterThan(0);
    expect(getAllByText('enhancement').length).toBeGreaterThan(0);
  });

  it('adds a new label filter when Add button is clicked', async () => {
    const setLabelFiltersMock = vi.fn();
    const { getByTestId, getByPlaceholderText } = render(
      <LabelFilter 
        {...mockProps} 
        setLabelFilters={setLabelFiltersMock}
      />
    );
    
    const input = getByPlaceholderText('Exclude by label') as HTMLInputElement;
    await userEvent.type(input, 'documentation');
    
    const addButton = getByTestId('addLabel');
    fireEvent.click(addButton);
    
    expect(setLabelFiltersMock).toHaveBeenCalledWith([...mockProps.labelFilters, 'documentation']);
  });

  it('does not add duplicate label filters', async () => {
    // Mock implementation to check if it contains the label
    const setLabelFiltersMock = vi.fn();
    const { getByTestId, getByPlaceholderText } = render(
      <LabelFilter 
        {...mockProps} 
        setLabelFilters={setLabelFiltersMock}
      />
    );
    
    const input = getByPlaceholderText('Exclude by label') as HTMLInputElement;
    await userEvent.type(input, 'bug');
    
    // Clear previous mock calls
    setLabelFiltersMock.mockClear();
    
    const addButton = getByTestId('addLabel');
    fireEvent.click(addButton);
    
    expect(setLabelFiltersMock).not.toHaveBeenCalled();
  });

  it('removes a label filter when X button is clicked', () => {
    const setLabelFiltersMock = vi.fn();
    const { getAllByText } = render(
      <LabelFilter 
        {...mockProps} 
        setLabelFilters={setLabelFiltersMock}
      />
    );
    
    const removeButtons = getAllByText('x');
    fireEvent.click(removeButtons[0]); // Remove the first label
    
    expect(setLabelFiltersMock).toHaveBeenCalledWith(['enhancement']);
  });

  it('adds a label filter when selected from combobox', () => {
    const setLabelFiltersMock = vi.fn();
    const { getByTestId } = render(
      <LabelFilter 
        {...mockProps} 
        setLabelFilters={setLabelFiltersMock}
      />
    );
    
    const combobox = getByTestId('mock-combobox');
    fireEvent.click(combobox);
    
    expect(setLabelFiltersMock).toHaveBeenCalledWith([...mockProps.labelFilters, 'mocked-selection']);
  });

  it('clears input after adding a label', async () => {
    const { getByTestId, getByPlaceholderText } = render(<LabelFilter {...mockProps} />);
    
    const input = getByPlaceholderText('Exclude by label') as HTMLInputElement;
    await userEvent.type(input, 'documentation');
    
    const addButton = getByTestId('addLabel');
    fireEvent.click(addButton);
    
    expect(input.value).toBe('');
  });
}); 