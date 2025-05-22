import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BlendsSection } from '../index';

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
        <BlendsSection blends={[]} isLoading={true} error={null} />
      </MemoryRouter>,
    );
    expect(screen.getByText('Blends')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders error state when error is present', () => {
    render(
      <MemoryRouter>
        <BlendsSection
          blends={[]}
          isLoading={false}
          error="Failed to load blends"
        />
      </MemoryRouter>,
    );
    expect(
      screen.getByText('Error loading blends: Failed to load blends'),
    ).toBeInTheDocument();
  });

  it('renders empty state when no blends are available', () => {
    render(
      <MemoryRouter>
        <BlendsSection blends={[]} isLoading={false} error={null} />
      </MemoryRouter>,
    );
    expect(screen.getByText('No blends available.')).toBeInTheDocument();
  });

  it('renders blends correctly', () => {
    render(
      <MemoryRouter>
        <BlendsSection blends={mockBlends} isLoading={false} error={null} />
      </MemoryRouter>,
    );
    expect(screen.getByText('Test Blend')).toBeInTheDocument();
  });

  it('renders blend with correct color gradient', () => {
    render(
      <MemoryRouter>
        <BlendsSection blends={mockBlends} isLoading={false} error={null} />
      </MemoryRouter>,
    );

    const colorElement = screen.getByTestId('blend-color');
    expect(colorElement).toHaveStyle({
      background: 'linear-gradient(to right, #FFA500, #FF0000)',
    });
  });
});
