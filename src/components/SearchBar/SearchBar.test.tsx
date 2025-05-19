import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from '.';

describe('SearchBar', () => {
  it('renders with the correct placeholder text', () => {
    const mockUpdateSearchString = vi.fn();
    render(
      <SearchBar searchString="" updateSearchString={mockUpdateSearchString} />,
    );

    const input = screen.getByPlaceholderText('Search spices and blends...');
    expect(input).toBeInTheDocument();
  });

  it('displays the initial search string value', () => {
    const mockUpdateSearchString = vi.fn();
    const initialValue = 'test search';

    render(
      <SearchBar
        searchString={initialValue}
        updateSearchString={mockUpdateSearchString}
      />,
    );

    const input = screen.getByDisplayValue(initialValue);
    expect(input).toBeInTheDocument();
  });

  it('calls updateSearchString when input changes', () => {
    const mockUpdateSearchString = vi.fn();

    render(
      <SearchBar searchString="" updateSearchString={mockUpdateSearchString} />,
    );

    const input = screen.getByPlaceholderText('Search spices and blends...');
    fireEvent.change(input, { target: { value: 'new search' } });

    expect(mockUpdateSearchString).toHaveBeenCalledWith('new search');
  });
});
