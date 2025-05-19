import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SpicesSection } from '.';

const mockSpices = [
  { id: '1', name: 'Cinnamon', color: 'A0522D' },
  { id: '2', name: 'Turmeric', color: 'FFA500' },
  { id: '3', name: 'Paprika', color: 'FF0000' },
];

describe('SpicesSection', () => {
  it('renders loading state correctly', () => {
    render(
      <MemoryRouter>
        <SpicesSection
          spices={[]}
          searchString=""
          isLoading={true}
          error={null}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('Spices')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument(); // Loading spinner
  });

  it('renders error state correctly', () => {
    const errorMessage = 'Failed to load spices';
    render(
      <MemoryRouter>
        <SpicesSection
          spices={[]}
          searchString=""
          isLoading={false}
          error={errorMessage}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('Spices')).toBeInTheDocument();
    expect(
      screen.getByText(`Error loading spices: ${errorMessage}`),
    ).toBeInTheDocument();
  });

  it('renders spices list correctly', () => {
    render(
      <MemoryRouter>
        <SpicesSection
          spices={mockSpices}
          searchString=""
          isLoading={false}
          error={null}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('Spices (3)')).toBeInTheDocument();
    mockSpices.forEach((spice) => {
      expect(screen.getByText(spice.name)).toBeInTheDocument();
    });
  });

  it('filters spices based on search string', () => {
    render(
      <MemoryRouter>
        <SpicesSection
          spices={mockSpices}
          searchString="cin"
          isLoading={false}
          error={null}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('Spices (1)')).toBeInTheDocument();
    expect(screen.getByText('Cinnamon')).toBeInTheDocument();
    expect(screen.queryByText('Turmeric')).not.toBeInTheDocument();
    expect(screen.queryByText('Paprika')).not.toBeInTheDocument();
  });

  it('shows no results message when no spices match search', () => {
    render(
      <MemoryRouter>
        <SpicesSection
          spices={mockSpices}
          searchString="xyz"
          isLoading={false}
          error={null}
        />
      </MemoryRouter>,
    );

    expect(
      screen.getByText('No spices found matching your search.'),
    ).toBeInTheDocument();
  });
});
