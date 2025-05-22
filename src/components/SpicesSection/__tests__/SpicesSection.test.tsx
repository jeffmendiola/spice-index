import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SpicesSection } from '../index';
import type { Spice } from '../../../types';

const mockSpices: Spice[] = [
  { id: 1, name: 'Cinnamon', color: 'D2691E', price: '$', heat: 0 },
  { id: 2, name: 'Turmeric', color: 'FFA500', price: '$', heat: 0 },
  { id: 3, name: 'Paprika', color: 'FF0000', price: '$$', heat: 2 },
];

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('SpicesSection', () => {
  it('renders loading state when isLoading is true', () => {
    renderWithRouter(
      <SpicesSection
        spices={[]}
        searchString=""
        isLoading={true}
        error={null}
      />,
    );
    expect(screen.getByText('Spices')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders error state when error is present', () => {
    renderWithRouter(
      <SpicesSection
        spices={[]}
        searchString=""
        isLoading={false}
        error="Failed to load spices"
      />,
    );
    expect(
      screen.getByText('Error loading spices: Failed to load spices'),
    ).toBeInTheDocument();
  });

  it('renders empty state when no spices are available', () => {
    renderWithRouter(
      <SpicesSection
        spices={[]}
        searchString=""
        isLoading={false}
        error={null}
      />,
    );
    expect(
      screen.getByText('No spices found matching your search.'),
    ).toBeInTheDocument();
  });

  it('renders filtered spices based on search string', () => {
    renderWithRouter(
      <SpicesSection
        spices={mockSpices}
        searchString="cin"
        isLoading={false}
        error={null}
      />,
    );
    expect(screen.getByText('Cinnamon')).toBeInTheDocument();
    expect(screen.queryByText('Turmeric')).not.toBeInTheDocument();
    expect(screen.queryByText('Paprika')).not.toBeInTheDocument();
  });

  it('renders all spices with correct colors and links', () => {
    renderWithRouter(
      <SpicesSection
        spices={mockSpices}
        searchString=""
        isLoading={false}
        error={null}
      />,
    );

    mockSpices.forEach((spice) => {
      expect(screen.getByText(spice.name)).toBeInTheDocument();
      const colorElement = screen.getByTestId(`spice-color-${spice.id}`);
      expect(colorElement).toHaveStyle({ backgroundColor: `#${spice.color}` });
      const link = screen.getByLabelText(`View details for ${spice.name}`);
      expect(link).toHaveAttribute('href', `/spices/${spice.id}`);
    });
  });

  it('renders no results message when search has no matches', () => {
    renderWithRouter(
      <SpicesSection
        spices={mockSpices}
        searchString="xyz"
        isLoading={false}
        error={null}
      />,
    );
    expect(
      screen.getByText('No spices found matching your search.'),
    ).toBeInTheDocument();
  });
});
