import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingState } from '../LoadingState';

describe('LoadingState', () => {
  it('renders with the provided title', () => {
    render(<LoadingState title="Loading Spices" />);
    expect(screen.getByText('Loading Spices')).toBeInTheDocument();
  });

  it('renders a loading spinner', () => {
    render(<LoadingState title="Loading Spices" />);
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('aria-live', 'polite');
  });
});
