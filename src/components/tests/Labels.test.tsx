import React from 'react';
import { render } from '@testing-library/react';
import Labels from '../Labels';
import { describe, expect, it } from 'vitest';
import { Label } from '../../types';

describe('Labels', () => {
  const mockLabels: Label[] = [
    { id: 1, name: 'bug', color: 'f00', description: 'A bug', url: 'https://github.com/labels/bug' },
    { id: 2, name: 'enhancement', color: '0f0', description: 'Enhancement', url: 'https://github.com/labels/enhancement' },
    { id: 3, name: 'documentation', color: '00f', description: 'Documentation', url: 'https://github.com/labels/documentation' }
  ];

  it('renders labels correctly when provided', () => {
    const { getByText } = render(<Labels labels={mockLabels} />);
    
    expect(getByText('bug')).toBeInTheDocument();
    expect(getByText('enhancement')).toBeInTheDocument();
    expect(getByText('documentation')).toBeInTheDocument();
  });

  it('renders nothing when labels array is empty', () => {
    const { container } = render(<Labels labels={[]} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when labels prop is undefined', () => {
    const { container } = render(<Labels />);
    
    expect(container.firstChild).toBeNull();
  });
}); 