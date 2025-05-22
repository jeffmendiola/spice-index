import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BlendsSection } from '../index';

// Mock the spices data
vi.mock('../../../mocks/data/spices', () => ({
  data: () => [
    { id: 1, name: 'Cumin', color: 'FFA500', price: '$', heat: 2 },
    { id: 2, name: 'Paprika', color: 'FF0000', price: '$', heat: 1 },
  ],
}));

describe('BlendsSection', () => {
  const mockBlends = [
    {
      id: 1,
      name: 'Test Blend',
      description: 'A test blend',
      spices: [1, 2],
      blends: [],
    },
  ];

  it('renders loading state when isLoading is true', () => {
    render(
      <MemoryRouter>
        <BlendsSection
          blends={[]}
          searchString=""
          isLoading={true}
          error={null}
        />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole('heading', { name: /blends/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders error state when error is present', () => {
    const errorMessage = 'Failed to load blends';
    render(
      <MemoryRouter>
        <BlendsSection
          blends={[]}
          searchString=""
          isLoading={false}
          error={errorMessage}
        />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole('heading', { name: /blends/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Error loading blends: ${errorMessage}`),
    ).toBeInTheDocument();
  });

  it('renders blends when data is loaded', () => {
    render(
      <MemoryRouter>
        <BlendsSection
          blends={mockBlends}
          searchString=""
          isLoading={false}
          error={null}
        />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole('heading', { name: /blends/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('Test Blend')).toBeInTheDocument();
  });

  it('filters blends based on search string', () => {
    const blends = [
      { ...mockBlends[0], name: 'Spicy Blend' },
      { ...mockBlends[0], id: 2, name: 'Sweet Blend' },
    ];

    render(
      <MemoryRouter>
        <BlendsSection
          blends={blends}
          searchString="spicy"
          isLoading={false}
          error={null}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('Spicy Blend')).toBeInTheDocument();
    expect(screen.queryByText('Sweet Blend')).not.toBeInTheDocument();
  });

  it('renders blend with correct color gradient', () => {
    render(
      <MemoryRouter>
        <BlendsSection
          blends={mockBlends}
          searchString=""
          isLoading={false}
          error={null}
        />
      </MemoryRouter>,
    );

    const colorElement = screen.getByTestId('blend-color');
    expect(colorElement).toHaveStyle({
      background: 'linear-gradient(to right, #FFA500, #FF0000)',
    });
  });
});
