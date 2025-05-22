import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorState } from '../ErrorState';

describe('ErrorState', () => {
  it('renders with the provided title and message', () => {
    render(<ErrorState title="Spices" message="Failed to load spices" />);
    expect(screen.getByText('Spices')).toBeInTheDocument();
    expect(
      screen.getByText('Error loading spices: Failed to load spices'),
    ).toBeInTheDocument();
  });

  it('renders error message in red', () => {
    render(<ErrorState title="Spices" message="Failed to load spices" />);
    const errorMessage = screen.getByText(
      'Error loading spices: Failed to load spices',
    );
    expect(errorMessage).toHaveClass('text-red-600');
  });
});
