import { render, fireEvent } from '@testing-library/react';
import SettingsPane from '../SettingsPane';
import { SettingsPaneProps } from '../../types';

const mockProps: SettingsPaneProps = {
  labelFilters: [],
  setLabelFilters: vi.fn(),
  allLabels: ['bug', 'feature'],
  prioritizedRepos: [],
  setPrioritizedRepos: vi.fn(),
  allRepoNames: ['repo1', 'repo2']
};

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
