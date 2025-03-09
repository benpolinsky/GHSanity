import SettingsPane from '../SettingsPane';
import { describe, expect, it, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { AppContext } from '../../store/AppContext';

// Mock createPortal for testing
// This helps tests work correctly since Next.js uses React DOM's createPortal
vi.mock('react-dom', async () => {
  const originalModule = await vi.importActual('react-dom');
  return {
    ...originalModule,
    createPortal: (node: React.ReactNode) => node,
  };
});

describe('SettingsPane', () => {
  it('renders SettingsPane and toggles visibility', () => {
    const { getByTestId, getByText, queryByText } = render(
      <AppContext.Provider value={initialState}>
        <SettingsPane />
      </AppContext.Provider>
    );

    const gearIcon = getByTestId('gear-icon');
    fireEvent.click(gearIcon);

    expect(getByText(/Label Filter/i)).toBeInTheDocument();

    const closeIcon = getByTestId('close-icon');
    fireEvent.click(closeIcon);

    expect(queryByText("Label Filter")).toBeFalsy();
  });
});
