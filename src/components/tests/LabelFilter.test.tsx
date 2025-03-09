import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import LabelFilter from '../LabelFilter';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { AppContext } from '../../store/AppContext';
import { initialState } from '@/store/AppReducer';

// Mock the combobox component for testing
vi.mock('@reach/combobox', () => ({
  Combobox: ({ children, onSelect }: { children: React.ReactNode, onSelect: (value: string) => void }) => (
    <div data-testid="mock-combobox" onClick={() => onSelect('mocked-selection')}>
      {children}
    </div>
  ),
  ComboboxInput: ({ value, onChange, placeholder }: { value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder: string }) => (
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
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with initial label filters', () => {
    const { getByText, getAllByText } = render(
      <AppContext.Provider value={initialState}>
        <LabelFilter />
      </AppContext.Provider>
    );

    expect(getByText('Label Filter')).toBeInTheDocument();

    // Just check that the labels are rendered
    expect(getAllByText('bug').length).toBeGreaterThan(0);
    expect(getAllByText('enhancement').length).toBeGreaterThan(0);
  });

  it('adds a new label filter when Add button is clicked', async () => {
    const { getByTestId, getByPlaceholderText } = render(
      <AppContext.Provider value={initialState}>
        <LabelFilter />
      </AppContext.Provider>
    );

    const input = getByPlaceholderText('Exclude by label') as HTMLInputElement;
    await userEvent.type(input, 'documentation');

    const addButton = getByTestId('addLabel');
    fireEvent.click(addButton);

    expect(setLabelFiltersMock).toHaveBeenCalledWith(['bug', 'enhancement', 'documentation']);
  });

  it('does not add duplicate label filters', async () => {
    const { getByTestId, getByPlaceholderText } = render(
      <AppContext.Provider value={initialState}>
        <LabelFilter />
      </AppContext.Provider>
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
    const { getAllByText } = render(
      <AppContext.Provider value={initialState}>
        <LabelFilter />
      </AppContext.Provider>
    );

    const removeButtons = getAllByText('x');
    fireEvent.click(removeButtons[0]); // Remove the first label

    expect(setLabelFiltersMock).toHaveBeenCalledWith(['enhancement']);
  });

  it('adds a label filter when selected from combobox', () => {
    const { getByTestId } = render(
      <AppContext.Provider value={initialState}>
        <LabelFilter />
      </AppContext.Provider>
    );

    const combobox = getByTestId('mock-combobox');
    fireEvent.click(combobox);

    expect(setLabelFiltersMock).toHaveBeenCalledWith(['bug', 'enhancement', 'mocked-selection']);
  });

  it('clears input after adding a label', async () => {
    const { getByTestId, getByPlaceholderText } = render(
      <AppContext.Provider value={initialState}>
        <LabelFilter />
      </AppContext.Provider>
    );

    const input = getByPlaceholderText('Exclude by label') as HTMLInputElement;
    await userEvent.type(input, 'documentation');

    const addButton = getByTestId('addLabel');
    fireEvent.click(addButton);

    expect(input.value).toBe('');
  });
});