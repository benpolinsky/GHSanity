import SettingsPane from '../SettingsPane';
import { SettingsPaneProps } from '../../types';
import { describe, expect, it, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';

const mockProps: SettingsPaneProps = {
  labelFilters: [],
  setLabelFilters: vi.fn(),
  allLabels: ['bug', 'feature'],
  prioritizedRepos: [],
  setPrioritizedRepos: vi.fn(),
  allRepoNames: ['repo1', 'repo2']
};

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
    const { getByTestId, getByText, queryByText } = render(<SettingsPane {...mockProps} />);
    
    const gearIcon = getByTestId('gear-icon');
    fireEvent.click(gearIcon);
    
    expect(getByText(/Label Filter/i)).toBeInTheDocument();
    
    const closeIcon = getByTestId('close-icon');
    fireEvent.click(closeIcon);
    
    expect(queryByText("Label Filter")).toBeFalsy();
  });
});
