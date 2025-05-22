import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ItemList } from '../ItemList';

interface TestItem {
  id: number;
  name: string;
}

const mockItems: TestItem[] = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
];

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ItemList', () => {
  it('renders the title with item count when items are present', () => {
    renderWithRouter(
      <ItemList<TestItem>
        items={mockItems}
        title="Test Items"
        renderItem={(item) => <div>{item.name}</div>}
        getItemLink={(item) => `/items/${item.id}`}
      />,
    );
    expect(screen.getByText('Test Items (2)')).toBeInTheDocument();
  });

  it('renders empty state message when no items are present', () => {
    renderWithRouter(
      <ItemList<TestItem>
        items={[]}
        title="Test Items"
        renderItem={(item) => <div>{item.name}</div>}
        getItemLink={(item) => `/items/${item.id}`}
      />,
    );
    expect(
      screen.getByText('No test items found matching your search.'),
    ).toBeInTheDocument();
  });

  it('renders all items with correct links', () => {
    renderWithRouter(
      <ItemList<TestItem>
        items={mockItems}
        title="Test Items"
        renderItem={(item) => <div>{item.name}</div>}
        getItemLink={(item) => `/items/${item.id}`}
      />,
    );

    mockItems.forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
      const link = screen.getByLabelText(`View details for ${item.name}`);
      expect(link).toHaveAttribute('href', `/items/${item.id}`);
    });
  });

  it('has correct ARIA attributes', () => {
    renderWithRouter(
      <ItemList<TestItem>
        items={mockItems}
        title="Test Items"
        renderItem={(item) => <div>{item.name}</div>}
        getItemLink={(item) => `/items/${item.id}`}
      />,
    );

    const section = screen.getByRole('region');
    expect(section).toHaveAttribute('aria-labelledby', 'test items-heading');

    const list = screen.getByRole('list');
    expect(list).toHaveAttribute('aria-label', 'List of test items');
  });
});
