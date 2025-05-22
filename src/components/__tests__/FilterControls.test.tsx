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

  it('renders price rating radio group and heat level pills', () => {
    render(<FilterControls {...defaultProps} />);
    expect(screen.getByText('Spice Price')).toBeInTheDocument();
    expect(screen.getByText('Spice Heat Level')).toBeInTheDocument();
    // Price radios
    expect(screen.getByLabelText('$')).toBeInTheDocument();
    expect(screen.getByLabelText('$$')).toBeInTheDocument();
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
        priceRating="$"
        heatLevel={2}
      />,
    );
    expect(screen.getByText('Reset Filters')).toBeInTheDocument();
  });

  it('hides reset button when no filters are active', () => {
    render(<FilterControls {...defaultProps} />);
    expect(screen.queryByText('Reset Filters')).not.toBeInTheDocument();
  });

  it('calls setPriceRating when price rating changes', () => {
    render(<FilterControls {...defaultProps} />);
    const priceRadio = screen.getByLabelText('$');
    fireEvent.click(priceRadio);
    expect(defaultProps.setPriceRating).toHaveBeenCalledWith('$');
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
        priceRating="$"
        heatLevel={2}
      />,
    );
    const resetButton = screen.getByText('Reset Filters');
    fireEvent.click(resetButton);
    expect(defaultProps.onReset).toHaveBeenCalled();
  });

  it('displays correct initial values', () => {
    render(<FilterControls {...defaultProps} priceRating="$$" heatLevel={4} />);
    const priceRadio = screen.getByLabelText('$$');
    expect(priceRadio).toBeChecked();
    const heatPill = getHeatPillButton(4);
    expect(heatPill).toHaveAttribute('aria-pressed', 'true');
  });
});
