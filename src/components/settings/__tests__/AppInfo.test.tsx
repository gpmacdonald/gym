import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AppInfo from '../AppInfo';

describe('AppInfo', () => {
  it('should render app name', () => {
    render(<AppInfo />);

    expect(screen.getByText('Personal Fitness Tracker')).toBeInTheDocument();
  });

  it('should render version number', () => {
    render(<AppInfo />);

    expect(screen.getByText(/Version 1\.0\.0/)).toBeInTheDocument();
  });

  it('should render info icon', () => {
    render(<AppInfo />);

    // Check for the icon container
    const iconContainer = document.querySelector('.bg-primary\\/10');
    expect(iconContainer).toBeInTheDocument();
  });
});
