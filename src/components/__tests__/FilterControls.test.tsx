import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterControls } from '../FilterControls';

describe('FilterControls', () => {
  const defaultProps = {
    searchString: '',
    priceRating: null,
    heatLevel: null,
    onReset: vi.fn(),
    setPriceRating: vi.fn(),
    setHeatLevel: vi.fn(),
  };

  it('renders price rating and heat level selectors', () => {
    render(<FilterControls {...defaultProps} />);

    expect(screen.getByLabelText('Spice Price:')).toBeInTheDocument();
    expect(screen.getByLabelText('Spice Heat Level:')).toBeInTheDocument();
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

    const priceSelect = screen.getByLabelText('Spice Price:');
    fireEvent.change(priceSelect, { target: { value: '$' } });

    expect(defaultProps.setPriceRating).toHaveBeenCalledWith('$');
  });

  it('calls setHeatLevel when heat level changes', () => {
    render(<FilterControls {...defaultProps} />);

    const heatSelect = screen.getByLabelText('Spice Heat Level:');
    fireEvent.change(heatSelect, { target: { value: '3' } });

    expect(defaultProps.setHeatLevel).toHaveBeenCalledWith(3);
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

    const priceSelect = screen.getByLabelText('Spice Price:');
    const heatSelect = screen.getByLabelText('Spice Heat Level:');

    expect(priceSelect).toHaveValue('$$');
    expect(heatSelect).toHaveValue('4');
  });
});
