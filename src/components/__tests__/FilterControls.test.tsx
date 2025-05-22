import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterControls } from '../FilterControls';

// Helper to get heat pill button by emoji count
const getHeatPillButton = (count: number) => {
  if (count === 0) return screen.getByRole('button', { name: 'No Heat' });
  return screen.getByRole('button', { name: '🔥'.repeat(count) });
};

describe('FilterControls', () => {
  const defaultProps = {
    searchString: '',
    priceRating: null,
    heatLevel: null,
    onReset: vi.fn(),
    setPriceRating: vi.fn(),
    setHeatLevel: vi.fn(),
  };

  it('renders price rating pills and heat level pills', () => {
    render(<FilterControls {...defaultProps} />);
    expect(screen.getByText('Spice Price')).toBeInTheDocument();
    expect(screen.getByText('Spice Heat Level')).toBeInTheDocument();
    // Price pills
    expect(screen.getByRole('button', { name: '$' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '$$' })).toBeInTheDocument();
    // Heat pills
    expect(getHeatPillButton(0)).toBeInTheDocument();
    expect(getHeatPillButton(1)).toBeInTheDocument();
    expect(getHeatPillButton(3)).toBeInTheDocument();
  });

  it('shows reset button when filters are active', () => {
    render(
      <FilterControls
        {...defaultProps}
        searchString="test"
        priceRating={1}
        heatLevel={2}
      />,
    );
    expect(screen.getByText('Reset Filters')).toBeInTheDocument();
  });

  it('hides reset button when no filters are active', () => {
    render(<FilterControls {...defaultProps} />);
    expect(screen.queryByText('Reset Filters')).not.toBeInTheDocument();
  });

  it('calls setPriceRating when a price pill is clicked', () => {
    render(<FilterControls {...defaultProps} />);
    const pricePill = screen.getByRole('button', { name: '$' });
    fireEvent.click(pricePill);
    expect(defaultProps.setPriceRating).toHaveBeenCalledWith(1);
  });

  it('calls setHeatLevel when a heat pill is clicked', () => {
    render(<FilterControls {...defaultProps} />);
    const heatPill = getHeatPillButton(3); // '🔥🔥🔥'
    fireEvent.click(heatPill);
    expect(defaultProps.setHeatLevel).toHaveBeenCalledWith(3);
  });

  it('toggles heat pill selection (deselects when clicked again)', () => {
    render(<FilterControls {...defaultProps} heatLevel={2} />);
    const heatPill = getHeatPillButton(2); // '🔥🔥'
    fireEvent.click(heatPill);
    expect(defaultProps.setHeatLevel).toHaveBeenCalledWith(null);
  });

  it('only one heat pill can be active at a time', () => {
    render(<FilterControls {...defaultProps} heatLevel={4} />);
    const pill = getHeatPillButton(4);
    expect(pill).toHaveAttribute('aria-pressed', 'true');
    // Others should not be active
    expect(getHeatPillButton(3)).toHaveAttribute('aria-pressed', 'false');
    expect(getHeatPillButton(5)).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onReset when reset button is clicked', () => {
    render(
      <FilterControls
        {...defaultProps}
        searchString="test"
        priceRating={1}
        heatLevel={2}
      />,
    );
    const resetButton = screen.getByText('Reset Filters');
    fireEvent.click(resetButton);
    expect(defaultProps.onReset).toHaveBeenCalled();
  });

  it('displays correct initial values', () => {
    render(<FilterControls {...defaultProps} priceRating={2} heatLevel={4} />);
    const pricePill = screen.getByRole('button', { name: '$$' });
    expect(pricePill).toHaveAttribute('aria-pressed', 'true');
    const heatPill = getHeatPillButton(4);
    expect(heatPill).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows selected state for price and heat pills', () => {
    render(<FilterControls {...defaultProps} priceRating={2} heatLevel={3} />);
    const pricePill = screen.getByRole('button', { name: '$$' });
    const heatPill = getHeatPillButton(3);
    expect(pricePill).toHaveAttribute('aria-pressed', 'true');
    expect(heatPill).toHaveAttribute('aria-pressed', 'true');
  });
});
