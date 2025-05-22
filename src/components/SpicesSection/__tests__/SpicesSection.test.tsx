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
      <SpicesSection spices={[]} isLoading={true} error={null} />,
    );
    expect(screen.getByText('Spices')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders error state when error is present', () => {
    renderWithRouter(
      <SpicesSection
        spices={[]}
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
      <SpicesSection spices={[]} isLoading={false} error={null} />,
    );
    expect(screen.getByText('No spices available.')).toBeInTheDocument();
  });

  it('renders spices correctly', () => {
    renderWithRouter(
      <SpicesSection spices={mockSpices} isLoading={false} error={null} />,
    );
    expect(screen.getByText('Cinnamon')).toBeInTheDocument();
    expect(screen.getByText('Turmeric')).toBeInTheDocument();
    expect(screen.getByText('Paprika')).toBeInTheDocument();
  });

  it('renders all spices with correct colors and links', () => {
    renderWithRouter(
      <SpicesSection spices={mockSpices} isLoading={false} error={null} />,
    );

    mockSpices.forEach((spice) => {
      expect(screen.getByText(spice.name)).toBeInTheDocument();
      const colorElement = screen.getByTestId(`spice-color-${spice.id}`);
      expect(colorElement).toHaveStyle({ backgroundColor: `#${spice.color}` });
      const link = screen.getByLabelText(`View details for ${spice.name}`);
      expect(link).toHaveAttribute('href', `/spices/${spice.id}`);
    });
  });
});
